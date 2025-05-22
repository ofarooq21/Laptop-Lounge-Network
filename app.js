const express          = require('express');
const path             = require('path');
const methodOverride   = require('method-override');
const mongoose         = require('mongoose');
const session          = require('express-session');
const MongoStore       = require('connect-mongo');
const flash            = require('connect-flash');

const itemRoutes  = require('./routes/itemRoutes');
const userRoutes  = require('./routes/userRoutes');

const app = express();

/* ──────────────────────────────
   MongoDB connection (Atlas)
──────────────────────────────── */
const MONGO_URI =
  'mongodb+srv://ofarooq:Password@project5.wsoaycy.mongodb.net/?retryWrites=true&w=majority&appName=Project5';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'project5'               // ← project 5 database
})
.then(() => console.log('✅ Connected to Atlas: project5'))
.catch(err => console.error('Mongo connect error:', err));

/* ──────────────────────────────
   App config
──────────────────────────────── */
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

/* ──────────────────────────────
   Session & flash
──────────────────────────────── */
app.use(
  session({
    secret: 'laptopexchange-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI, dbName: 'project5' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);
app.use(flash());

/* ──────────────────────────────
   Global template vars
──────────────────────────────── */
app.use((req, res, next) => {
  res.locals.currentUserId = req.session.userId || null;
  res.locals.success       = req.flash('success');
  res.locals.error         = req.flash('error');
  next();
});

/* ──────────────────────────────
   Routes
──────────────────────────────── */
app.use('/',      userRoutes);     // /, /users/…
app.use('/items', itemRoutes);     // items + nested offers

/* 404 */
app.use((req, res) =>
  res.status(404).render('error', { code: 404, message: 'Resource not found!' })
);

/* ──────────────────────────────
   Start server
──────────────────────────────── */
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));