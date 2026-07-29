const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const querystring = require('querystring');

// Writeable directory on Vercel Serverless environment is /tmp
const isVercel = process.env.VERCEL || process.env.AWS_EXECUTION_ENV;
const DB_PATH = isVercel ? '/tmp/portfolio.db' : path.join(__dirname, '../portfolio.db');

let db;
try {
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
  console.error("Database initialization error:", e);
}

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

  // Handle /api/contact (POST)
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

        const insertStmt = db.prepare(`
          INSERT INTO messages (name, email, subject, message)
          VALUES (?, ?, ?, ?)
        `);
        const result = insertStmt.run(name, email, subject, message);

        return sendJSON(201, {
          success: true,
          message: 'Message saved to database successfully!',
          id: Number(result.lastInsertRowid)
        });
      } catch (err) {
        return sendJSON(500, { success: false, error: err.message });
      }
    });
    return;
  }

  // Handle /api/messages (GET)
  if (pathname.includes('/api/messages') && req.method === 'GET') {
    try {
      const selectStmt = db.prepare(`SELECT * FROM messages ORDER BY id DESC`);
      const messages = selectStmt.all();
      return sendJSON(200, { success: true, messages });
    } catch (err) {
      return sendJSON(500, { success: false, error: err.message });
    }
  }

  // Handle DELETE /api/messages/:id
  if (pathname.includes('/api/messages/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop();
    try {
      const deleteStmt = db.prepare(`DELETE FROM messages WHERE id = ?`);
      deleteStmt.run(id);
      return sendJSON(200, { success: true, message: `Message ${id} deleted.` });
    } catch (err) {
      return sendJSON(500, { success: false, error: err.message });
    }
  }

  return sendJSON(404, { success: false, error: 'API route not found' });
};
