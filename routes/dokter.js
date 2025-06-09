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

// Tampilkan semua dokter (bisa tanpa login)
router.get('/', (req, res) => {
  db.query('SELECT * FROM dokter', (err, results) => {
    if (err) throw err;
    res.render('dokter/index', { dokter: results, user: req.session.user });
  });
});

// Form tambah dokter
router.get('/create', isLoggedIn, (req, res) => {
  res.render('dokter/create');
});

// Proses tambah dokter
router.post('/create', isLoggedIn, (req, res) => {
  const { nama, spesialisasi, no_telepon } = req.body;
  db.query(
    'INSERT INTO dokter (nama, spesialisasi, no_telepon) VALUES (?, ?, ?)',
    [nama, spesialisasi, no_telepon],
    (err) => {
      if (err) throw err;
      res.redirect('/dokter');
    }
  );
});

// Form edit dokter
router.get('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM dokter WHERE id_dokter = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send('Dokter tidak ditemukan');
    }
    res.render('dokter/edit', { dokter: results[0] });
  });
});

// Proses update dokter
router.post('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { nama, spesialisasi, no_telepon } = req.body;
  db.query(
    'UPDATE dokter SET nama = ?, spesialisasi = ?, no_telepon = ? WHERE id_dokter = ?',
    [nama, spesialisasi, no_telepon, id],
    (err) => {
      if (err) throw err;
      res.redirect('/dokter');
    }
  );
});

// Hapus dokter
router.get('/delete/:id', isLoggedIn, (req, res) => {
  db.query('DELETE FROM dokter WHERE id_dokter = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/dokter');
  });
});

module.exports = router;
