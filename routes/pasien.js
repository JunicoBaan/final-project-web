const express = require('express');
const db = require('../models/db');
const router = express.Router();

// Middleware: hanya bisa diakses jika sudah login
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Tampilkan semua pasien (bebas diakses, tapi user tetap dikirim ke view)
router.get('/', (req, res) => {
  db.query('SELECT * FROM pasien', (err, results) => {
    if (err) throw err;
    res.render('pasien/index', {
      pasien: results,
      user: req.session.user || null
    });
  });
});

// Form tambah pasien
router.get('/create', isLoggedIn, (req, res) => {
  res.render('pasien/create');
});

// Proses tambah pasien
router.post('/create', isLoggedIn, (req, res) => {
  const { nama, alamat, no_telepon } = req.body;
  db.query('INSERT INTO pasien (nama, alamat, no_telepon) VALUES (?, ?, ?)', [nama, alamat, no_telepon], (err) => {
    if (err) throw err;
    res.redirect('/pasien');
  });
});

// Form edit pasien
router.get('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pasien WHERE id_pasien = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send('Pasien tidak ditemukan');
    }
    res.render('pasien/edit', {
      pasien: results[0],
      user: req.session.user || null
    });
  });
});

// Proses update pasien
router.post('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { nama, alamat, no_telepon } = req.body;
  db.query(
    'UPDATE pasien SET nama = ?, alamat = ?, no_telepon = ? WHERE id_pasien = ?',
    [nama, alamat, no_telepon, id],
    (err) => {
      if (err) throw err;
      res.redirect('/pasien');
    }
  );
});

// Hapus pasien
router.get('/delete/:id', isLoggedIn, (req, res) => {
  db.query('DELETE FROM pasien WHERE id_pasien = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/pasien');
  });
});

module.exports = router;
