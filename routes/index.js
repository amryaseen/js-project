const express = require('express');

const router = express.Router();




//books inf

const books = [

  { id: 1, title: 'Modern Programming Languages', subject: 'CS101', price: 5 },

  { id: 2, title: 'Network Basics', subject: 'NET201', price: 7 },

  { id: 3, title: 'Linear algebra ', subject: 'MATH150', price: 4 },

];





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

module.exports = router;
 