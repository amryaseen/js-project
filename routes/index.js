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
 res.render('register', { error: null, name:'' , email:'' });
});


// Register page - POST (process the form)
router.post('/register', (req, res) => {
 const { name, email, password } = req.body;
 
 
 
 // Basic validation
 if (!name || !email || !password) {
   return res.render('register', { error: 'All fields are required.' });
 }
 if (!email.includes('@')) {
   return res.render('register', { error: 'Please enter a valid email.' });
 }
 if (password.length < 6) {
   return res.render('register', { error: 'Password must be at least 6 characters.' });
 }
 
 
 // Check if email already exists
 const existingUser = users.find(u => u.email === email);
 if (existingUser) {
   return res.render('register', { error: 'This email is already registered.' });
 }


 // Save the new user
 users.push({ name, email, password });
 // Redirect to login page after successful registration
 res.redirect('/login');
});
module.exports = router;
 