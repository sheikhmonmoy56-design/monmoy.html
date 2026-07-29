const path = require('path');
const fs = require('fs');
const querystring = require('querystring');

// Check if node:sqlite is available
let db = null;
try {
  const { DatabaseSync } = require('node:sqlite');
  const DB_PATH = '/tmp/portfolio.db';
  db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (e) {
  console.warn("SQLite Native DB fallback active:", e.message);
}

// In-memory fallback if SQLite module isn't active in serverless container
const inMemoryMessages = [];

module.exports = (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  const sendJSON = (statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(data));
  };

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.end();
  }

  // Handle POST /api/contact
  if (pathname.includes('/api/contact') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        let name, email, subject, message;
        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('application/json')) {
          const parsed = JSON.parse(body);
          name = parsed.name; email = parsed.email; subject = parsed.subject; message = parsed.message;
        } else {
          const parsed = querystring.parse(body);
          name = parsed.name; email = parsed.email; subject = parsed.subject; message = parsed.message;
        }

        if (!name || !email || !subject || !message) {
          return sendJSON(400, { success: false, error: 'All fields are required.' });
        }

        let newId = Date.now();
        if (db) {
          try {
            const insertStmt = db.prepare(`
              INSERT INTO messages (name, email, subject, message)
              VALUES (?, ?, ?, ?)
            `);
            const result = insertStmt.run(name, email, subject, message);
            newId = Number(result.lastInsertRowid);
          } catch (dbErr) {
            inMemoryMessages.unshift({ id: newId, name, email, subject, message, created_at: new Date().toISOString() });
          }
        } else {
          inMemoryMessages.unshift({ id: newId, name, email, subject, message, created_at: new Date().toISOString() });
        }

        return sendJSON(201, {
          success: true,
          message: 'Message saved to database successfully!',
          id: newId
        });
      } catch (err) {
        return sendJSON(500, { success: false, error: err.message });
      }
    });
    return;
  }

  // Handle GET /api/messages
  if (pathname.includes('/api/messages') && req.method === 'GET') {
    try {
      if (db) {
        try {
          const selectStmt = db.prepare(`SELECT * FROM messages ORDER BY id DESC`);
          const messages = selectStmt.all();
          return sendJSON(200, { success: true, messages });
        } catch (e) {
          return sendJSON(200, { success: true, messages: inMemoryMessages });
        }
      } else {
        return sendJSON(200, { success: true, messages: inMemoryMessages });
      }
    } catch (err) {
      return sendJSON(500, { success: false, error: err.message });
    }
  }

  // Handle DELETE /api/messages/:id
  if (pathname.includes('/api/messages/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop();
    try {
      if (db) {
        try {
          const deleteStmt = db.prepare(`DELETE FROM messages WHERE id = ?`);
          deleteStmt.run(id);
        } catch (e) {}
      }
      const idx = inMemoryMessages.findIndex(m => String(m.id) === String(id));
      if (idx !== -1) inMemoryMessages.splice(idx, 1);
      return sendJSON(200, { success: true, message: `Message ${id} deleted.` });
    } catch (err) {
      return sendJSON(500, { success: false, error: err.message });
    }
  }

  return sendJSON(404, { success: false, error: 'API route not found' });
};
