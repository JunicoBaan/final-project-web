const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti kalau MySQL kamu pakai password
  database: 'klinik_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Terhubung ke database anjaiii!');
});

module.exports = connection;
