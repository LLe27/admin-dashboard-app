const mysql = require('mysql');

// Database configuration
const db = mysql.createConnection({
    host: "db",
    port: "3306",
    user: "root",
    password: "password",
    database: "users"
})

// Database connection
db.connect((err) => {
    // Note: Handle database connection failure more gracefully
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MySQL database!');
    }
});

module.exports = db;