const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Middleware cek login
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// TAMPILKAN SEMUA REKAM MEDIS (bisa diakses publik)
router.get('/', (req, res) => {
  const sql = `
    SELECT rm.*, ps.nama AS nama_pasien, dk.nama AS nama_dokter
    FROM rekam_medis rm
    JOIN pendaftaran pd ON rm.id_pendaftaran = pd.id_pendaftaran
    JOIN pasien ps ON pd.id_pasien = ps.id_pasien
    JOIN dokter dk ON pd.id_dokter = dk.id_dokter
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('rekamMedis/index', { rekamMedis: results, user: req.session.user });
  });
});

// FORM TAMBAH (hanya jika login)
router.get('/create', isLoggedIn, (req, res) => {
  const sql = `
    SELECT pd.id_pendaftaran, ps.nama AS nama_pasien, dk.nama AS nama_dokter
    FROM pendaftaran pd
    JOIN pasien ps ON pd.id_pasien = ps.id_pasien
    JOIN dokter dk ON pd.id_dokter = dk.id_dokter
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('rekamMedis/create', { pendaftaran: results, user: req.session.user });
  });
});

// PROSES TAMBAH
router.post('/create', isLoggedIn, (req, res) => {
  const { id_pendaftaran, diagnosa, tindakan } = req.body;
  const sql = 'INSERT INTO rekam_medis (id_pendaftaran, diagnosa, tindakan) VALUES (?, ?, ?)';
  db.query(sql, [id_pendaftaran, diagnosa, tindakan], (err) => {
    if (err) throw err;
    res.redirect('/rekamMedis');
  });
});

// FORM EDIT (hanya jika login)
router.get('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const getRekamMedis = 'SELECT * FROM rekam_medis WHERE id_rekam = ?';
  const getPendaftaran = `
    SELECT pd.id_pendaftaran, ps.nama AS nama_pasien, dk.nama AS nama_dokter
    FROM pendaftaran pd
    JOIN pasien ps ON pd.id_pasien = ps.id_pasien
    JOIN dokter dk ON pd.id_dokter = dk.id_dokter
  `;

  db.query(getRekamMedis, [id], (err, rekamResult) => {
    if (err) throw err;
    if (rekamResult.length === 0) return res.send('Data tidak ditemukan');

    db.query(getPendaftaran, (err, pendaftaranResult) => {
      if (err) throw err;
      res.render('rekamMedis/edit', {
        rekamMedis: rekamResult[0],
        pendaftaran: pendaftaranResult,
        user: req.session.user
      });
    });
  });
});

// PROSES EDIT
router.post('/:id/edit', isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { id_pendaftaran, diagnosa, tindakan } = req.body;
  const sql = `
    UPDATE rekam_medis
    SET id_pendaftaran = ?, diagnosa = ?, tindakan = ?
    WHERE id_rekam = ?
  `;
  db.query(sql, [id_pendaftaran, diagnosa, tindakan, id], (err) => {
    if (err) throw err;
    res.redirect('/rekamMedis');
  });
});

// HAPUS (hanya jika login)
router.get('/delete/:id', isLoggedIn, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM rekam_medis WHERE id_rekam = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/rekamMedis');
  });
});

module.exports = router;
