const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6679802',
  database: 'sql6679802',
  password: 'bNcBXkMabT'
});
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the SQL db');
})

module.exports = connection;