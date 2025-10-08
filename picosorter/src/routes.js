const express = require("express");
const next = require("next");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  // connect to db
  const db = new sqlite3.Database(
    "/Users/carl/Documents/GitHub/PicoSorter/picosorter/src/database/picosorter.db",
    (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    }
  );

  // Example route to get all users
  server.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ users: rows });
    });
  });

  // Route to authenticate users
  server.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    db.get(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (row) {
          res.json({ message: "Login successful", user: row });
        } else {
          res.status(401).json({ message: "Invalid username or password" });
        }
      }
    );
  });

  // Route to create a new user
  //TODO: untested route
  server.post("/api/users", (req, res) => {
    const { username, password } = req.body;
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: "User created successfully", userId: this.lastID });
      }
    );
  });

  // fetch all inventory items
  server.get("/api/inventory", (req, res) => {
    db.all("SELECT * FROM inventory", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ inventory: rows });
    });
  });

  // route to add an inventory item
  server.post("/api/inventory", upload.single("image"), (req, res) => {
    const { name, color, price, description, quantity } = req.body;
    const image = req.file ? req.file.buffer : null; // raw binary buffer

    db.run(
      "INSERT INTO inventory (name, color, price, description, quantity, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, color, price, description, quantity, image],
      function (err) {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({
          message: "Inventory item added successfully",
          itemId: this.lastID,
        });
      }
    );
  });

  // route to delete an inventory item
  server.delete("/api/inventory/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM inventory WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json({ message: "Inventory item deleted successfully" });
    });
  });

  // Default next.js request handler
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3030, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3030");
  });
});
