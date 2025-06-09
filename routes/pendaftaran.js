const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Middleware login
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// TAMPILKAN SEMUA PENDAFTARAN
router.get('/', (req, res) => {
  const sql = `
    SELECT pd.*, ps.nama AS nama_pasien, dk.nama AS nama_dokter
    FROM pendaftaran pd
    JOIN pasien ps ON pd.id_pasien = ps.id_pasien
    JOIN dokter dk ON pd.id_dokter = dk.id_dokter
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('pendaftaran/index', {
      pendaftaran: results,
      isLoggedIn: !!req.session.user
    });
  });
});

// FORM TAMBAH PENDAFTARAN — tanpa login pun bisa
router.get('/create', (req, res) => {
  const sqlPasien = 'SELECT * FROM pasien';
  const sqlDokter = 'SELECT * FROM dokter';

  db.query(sqlPasien, (err, pasienResults) => {
    if (err) throw err;
    db.query(sqlDokter, (err, dokterResults) => {
      if (err) throw err;
      res.render('pendaftaran/create', {
        pasien: pasienResults,
        dokter: dokterResults
      });
    });
  });
});

// PROSES TAMBAH — sudah termasuk tanggal sekarang ✅
router.post('/create', (req, res) => {
  const { id_pasien, id_dokter, tanggal, keluhan } = req.body;
  const sql = `
    INSERT INTO pendaftaran (id_pasien, id_dokter, tanggal, keluhan)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [id_pasien, id_dokter, tanggal, keluhan], (err) => {
    if (err) throw err;
    res.redirect('/pendaftaran');
  });
});

// FORM EDIT — hanya jika login
router.get('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const getPendaftaran = 'SELECT * FROM pendaftaran WHERE id_pendaftaran = ?';
  const sqlPasien = 'SELECT * FROM pasien';
  const sqlDokter = 'SELECT * FROM dokter';

  db.query(getPendaftaran, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send('Data tidak ditemukan');

    db.query(sqlPasien, (err, pasienResults) => {
      if (err) throw err;
      db.query(sqlDokter, (err, dokterResults) => {
        if (err) throw err;
        res.render('pendaftaran/edit', {
          pendaftaran: results[0],
          pasien: pasienResults,
          dokter: dokterResults
        });
      });
    });
  });
});

// PROSES EDIT — termasuk update tanggal juga ✅
router.post('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { id_pasien, id_dokter, tanggal, keluhan } = req.body;
  const sql = `
    UPDATE pendaftaran
    SET id_pasien = ?, id_dokter = ?, tanggal = ?, keluhan = ?
    WHERE id_pendaftaran = ?
  `;
  db.query(sql, [id_pasien, id_dokter, tanggal, keluhan, id], (err) => {
    if (err) throw err;
    res.redirect('/pendaftaran');
  });
});

// HAPUS — hanya jika login
router.get('/:id/delete', isLoggedIn, (req, res) => {
  db.query('DELETE FROM pendaftaran WHERE id_pendaftaran = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/pendaftaran');
  });
});

module.exports = router;
