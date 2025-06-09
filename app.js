const express = require('express');
const session = require('express-session');
const path = require('path');
const authRouter = require('./routes/auth');
const pasienRouter = require('./routes/pasien');
const dokterRouter = require('./routes/dokter');
const pendaftaranRouter = require('./routes/pendaftaran');
const rekamMedisRoutes = require('./routes/rekamMedis');
const homeRouter = require('./routes/home');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session config
app.use(session({
  secret: 'rahasia123',
  resave: false,
  saveUninitialized: true
}));

// Middleware global - bikin isLoggedIn bisa diakses di semua EJS
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.user;
  res.locals.user = req.session.user || null; 
  next();
});

// Routing
app.use('/', authRouter);
app.use('/pasien', pasienRouter);
app.use('/dokter', dokterRouter);
app.use('/pendaftaran', pendaftaranRouter);
app.use('/rekamMedis', rekamMedisRoutes);
app.use('/', homeRouter); 


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
