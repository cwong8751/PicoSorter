const express = require('express');
const next = require('next');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  const db = new sqlite3.Database('./database/picosorter.db');

  // Example route to get all users
  server.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ users: rows });
    });
  });

  // Route to authenticate users
  server.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (row) {
        res.json({ message: 'Login successful', user: row });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });

  // Route to create a new user
  //TODO: untested route
  server.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User created successfully', userId: this.lastID });
    });
  });

  // Default next.js request handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3030, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3030');
  });
});