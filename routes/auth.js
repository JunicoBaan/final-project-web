const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.render('login', { error: 'Username tidak ditemukan.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = user;
      res.redirect('/pasien'); // ✅ Langsung arahkan ke halaman utama
    } else {
      res.render('login', { error: 'Password salah.' });
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
