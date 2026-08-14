const express = require('express');

const router = express.Router();




//books inf
 
const books = [

  { id: 1, title: 'Modern Programming Languages', subject: 'CS101', price: 5 },

  { id: 2, title: 'Network Basics', subject: 'NET201', price: 7 },

  { id: 3, title: 'Linear algebra ', subject: 'MATH150', price: 4 },

];
//Temporary in memory user storage(will move in mongodb phase3)
const users=[];




// Home

router.get('/', (req, res) => {

  res.render('index', { title: '' });

});







// About

router.get('/about', (req, res) => {

  res.render('about', {

    team: ['Amr ', 'Hamza', 'Mohannad', ' Rayan', 'Yazan']

  });

});









// Features

router.get('/features', (req, res) => {

  res.render('features', { books: books });

});












// Item Detail

router.get('/book/:id', (req, res) => {

  const bookId = parseInt(req.params.id);

  const book = books.find(b => b.id === bookId);

  if (!book) {

    return res.status(404).render('404');

  }

  res.render('item-detail', { book: book });

});
// Register page - GET (display the form)
router.get('/register', (req, res) => {
 res.render('register', { error: null, name: '', email: '' });
});


// Register page - POST (process the form)
router.post('/register', (req, res) => {
 const { name, email, password } = req.body;
 
 
 
 // Basic validation
 if (!name || !email || !password) {
   return res.render('register', { error: 'All fields are required.', name, email });
 }
 if (!email.includes('@')) {
   return res.render('register', { error: 'Please enter a valid email.', name, email });
 }
 if (password.length < 6) {
   return res.render('register', { error: 'Password must be at least 6 characters.', name, email });
 }
 
 
 // Check if email already exists
 const existingUser = users.find(u => u.email === email);
 if (existingUser) {
   return res.render('register', { error: 'This email is already registered.', name, email });
 }


 // Save the new user
 users.push({ name, email, password });
 // Redirect to login page after successful registration
 res.redirect('/login');
});

// Login page - GET (display the form)
router.get('/login', (req, res) => {
 res.render('login', { error: null, email: '' });
});

// Login page - POST (process the form and create a session)
router.post('/login', (req, res) => {
 const { email, password } = req.body;

 if (!email || !password) {
   return res.render('login', { error: 'All fields are required.', email: email || '' });
 }

 const user = users.find(u => u.email === email && u.password === password);

 if (!user) {
   return res.render('login', { error: 'Invalid email or password.', email });
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

// Cookie preference page - GET (read cookies)
router.get('/cookie-preference', (req, res) => {
 res.render('cookie-preference', {
   theme: req.cookies.theme || 'light',
   language: req.cookies.language || 'en',
   saved: req.query.saved || ''
 });
});

// Cookie preference page - POST (set cookies)
router.post('/cookie-preference', (req, res) => {
 const { theme, language } = req.body;

 res.cookie('theme', theme, {
   maxAge: 7 * 24 * 60 * 60 * 1000
 });

 res.cookie('language', language, {
   maxAge: 7 * 24 * 60 * 60 * 1000
 });

 res.redirect('/cookie-preference?saved=1');
});






// Search/Filter page uses GET with query string to filter books

router.get('/search', (req, res) => {

  const searchTerm = req.query.subject;

 
  let results = books;

  if (searchTerm) {

    results = books.filter(book =>

      book.subject.toLowerCase().includes(searchTerm.toLowerCase())

    );

  }

  res.render('search', { books: results, searchTerm: searchTerm || '' });

});
 


module.exports = router;
 
