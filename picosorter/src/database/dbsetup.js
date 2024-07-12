const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');


// initialize database
const db = new sqlite.Database('./picosorter.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the picosorter database.');
});

// read image file
function readImageFile(filepath) {
    return fs.readFileSync(filepath);
}

// run preset methods to create tables
db.serialize(() => {
    // create table for users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password PASSWORD
    )`);

    // create table for inventory
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY,
      name TEXT,
      color TEXT,
      price DECIMAL,
      sale BOOLEAN,
      description TEXT,
      quantity INTEGER,
      image BLOB
    )`);

    // insert test user
    db.run(`INSERT INTO users (username, password) VALUES ('admin', 'admin')`);
    console.log('Test user inserted');

    // insert test inventory item
    const imagePath = path.join(__dirname, '../assets/dice.jpg');
    const imageData = readImageFile(imagePath);

    const insertStmt = db.prepare(`INSERT INTO inventory (name, color, price, sale, description, quantity, image) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    insertStmt.run('dice', 'white', 10.00, 1, 'this is a dice', 10, imageData, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Test inventory item inserted');
        }
    });
    insertStmt.finalize();
});

// close connexion to db 
db.close();