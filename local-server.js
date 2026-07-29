const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const querystring = require('querystring');

const PORT = 3000;
const DB_PATH = path.join(__dirname, 'portfolio.db');

// Initialize SQLite Database
const db = new DatabaseSync(DB_PATH);

// Create Messages Table
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

console.log('Database initialized successfully: portfolio.db');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Set CORS & JSON headers helper
  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
  };

  // Pre-flight CORS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // API Route: Submit Contact Form -> Insert into Database
  if (pathname === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        let name, email, subject, message;
        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('application/json')) {
          const parsed = JSON.parse(body);
          name = parsed.name;
          email = parsed.email;
          subject = parsed.subject;
          message = parsed.message;
        } else {
          const parsed = querystring.parse(body);
          name = parsed.name;
          email = parsed.email;
          subject = parsed.subject;
          message = parsed.message;
        }

        if (!name || !email || !subject || !message) {
          return sendJSON(400, { success: false, error: 'All fields are required.' });
        }

        const insertStmt = db.prepare(`
          INSERT INTO messages (name, email, subject, message)
          VALUES (?, ?, ?, ?)
        `);
        const result = insertStmt.run(name, email, subject, message);

        console.log(`[DB] New message saved (ID: ${result.lastInsertRowid}) from ${name} (${email})`);

        return sendJSON(201, {
          success: true,
          message: 'Message saved to database successfully!',
          id: Number(result.lastInsertRowid)
        });
      } catch (err) {
        console.error('[DB Error]', err);
        return sendJSON(500, { success: false, error: 'Database processing error: ' + err.message });
      }
    });
    return;
  }

  // API Route: Fetch All Messages from Database
  if (pathname === '/api/messages' && req.method === 'GET') {
    try {
      const selectStmt = db.prepare(`SELECT * FROM messages ORDER BY id DESC`);
      const messages = selectStmt.all();
      return sendJSON(200, { success: true, messages });
    } catch (err) {
      console.error('[DB Error]', err);
      return sendJSON(500, { success: false, error: 'Failed to retrieve messages.' });
    }
  }

  // API Route: Delete Message by ID
  if (pathname.startsWith('/api/messages/') && req.method === 'DELETE') {
    const id = pathname.split('/')[3];
    try {
      const deleteStmt = db.prepare(`DELETE FROM messages WHERE id = ?`);
      deleteStmt.run(id);
      console.log(`[DB] Deleted message ID: ${id}`);
      return sendJSON(200, { success: true, message: `Message ${id} deleted.` });
    } catch (err) {
      return sendJSON(500, { success: false, error: 'Failed to delete message.' });
    }
  }

  // Static File Server Logic
  let reqUrl = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(__dirname, reqUrl);
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Page Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Portfolio Server with SQLite Database is running!`);
  console.log(`🌐 Website URL:   http://localhost:${PORT}/`);
  console.log(`📊 Admin Panel:   http://localhost:${PORT}/admin.html`);
  console.log(`💾 Database File: portfolio.db`);
  console.log(`==================================================\n`);
});
