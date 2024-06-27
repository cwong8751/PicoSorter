const sqlite = require('sqlite3').verbose();


// initialize database
const db = new sqlite.Database('./picosorter.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the picosorter database.');
});

// run preset methods to create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password PASSWORD
    )`);
});

// close connexion to db 
db.close();