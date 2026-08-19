const express = require('express');
const router = express.Router();
const en=require('../lang/en');
const ar=require('../lang/ar');


const books = [
  { id: 1, title: 'Modern Programming Languages', subject: 'CS101', price: 5 },
  { id: 2, title: 'Network Basics', subject: 'NET201', price: 7 },
  { id: 3, title: 'Linear algebra ', subject: 'MATH150', price: 4 },
];


const users = [];

// Home
router.get('/', (req, res) => {
  
  res.render('index', { title: '', currentPage: 'home' });
});

// About
router.get('/about', (req, res) => {
 
  res.render('about', {
    team: ['Amr', 'Hamza', 'Mohannad', 'Rayan', 'Yazan'],
    currentPage: 'about'
  });
});


router.get('/features', (req, res) => {

  res.render('features', { books: books, currentPage: 'books' });
});


router.get('/book/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) {
    
    return res.status(404).render('404', { currentPage: '' });
  }

  res.render('item-detail', { book: book, currentPage: 'books' });
});


router.get('/register', (req, res) => {
  const lang=req.cookies.language || 'en';
  const t=lang == 'ar' ? ar:en;
  
  res.render('register', { error: null, name: '', email: '', currentPage: 'register' });
});


router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const lang=req.cookies.language || 'en';
  const t=lang == 'ar' ? ar:en;
  
  
  if (!name || !email || !password) {
    return res.render('register', { error: 'All fields are required.', name, email, currentPage: 'register' });
  }
  if (!email.includes('@')) {
    return res.render('register', { error: 'Please enter a valid email.', name, email, currentPage: 'register' });
  }
  if (password.length < 6) {
    return res.render('register', { error: 'Password must be at least 6 characters.', name, email, currentPage: 'register' });
  }


  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.render('register', { error: 'This email is already registered.', name, email, currentPage: 'register' });
  }


  users.push({ name, email, password });
  // Redirect to login page after successful registration
  res.redirect('/login');
});


router.get('/login', (req, res) => {
  // إضافة currentPage: 'login'
  res.render('login', { error: null, email: '', currentPage: 'login' });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const lang=req.cookies.language || 'en';
  const t=lang == 'ar' ? ar:en;
  if (!email || !password) {
    return res.render('login', { error: 'All fields are required.', email: email || '', currentPage: 'login' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.render('login', { error: 'Invalid email or password.', email, currentPage: 'login' });
  }

  req.session.user = {
    name: user.name,
    email: user.email
  };

  req.session.save(() => {
    res.redirect('/');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


router.get('/cookie-preference', (req, res) => {
  // إضافة currentPage: 'cookie'
  res.render('cookie-preference', {
    theme: req.cookies.theme || 'light',
    language: req.cookies.language || 'en',
    saved: req.query.saved || '',
    currentPage: 'cookie'
  });
});


router.post('/cookie-preference', (req, res) => {
  const { theme, language } = req.body;

  res.cookie('theme', theme, {
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.cookie('language', language, {
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.render('cookie-preference', {theme,language,saved:true});
});


router.get('/search', (req, res) => {
  const searchTerm = req.query.subject;

  let results = books;
  if (searchTerm) {
    results = books.filter(book =>
      book.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  res.render('search', { books: results, searchTerm: searchTerm || '', currentPage: 'search' });
});


function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.get('/dashboard', isAuthenticated, (req, res) => {
  const myListedBooksCount = 3;
  const myRequestsCount = 2;
  
  
  res.render('dashboard', {
    title: 'User Dashboard - Book Exchange',
    user: req.session.user,
    myListedBooksCount: myListedBooksCount,
    myRequestsCount: myRequestsCount,
    currentPage: 'dashboard'
  });
});

module.exports = router;