const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dmp-accounts',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = connection;