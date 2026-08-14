const express = require('express');
const session = require('express-session');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(session({
 secret: 'book-exchange-secret',
 resave: false,
 saveUninitialized: false
}));
app.use((req, res, next) => {
 res.locals.user = req.session.user || null;
 next();
});
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);



// 404 - لازم يكون آخر شي





app.use((req, res) => {
 res.status(404).render('404');
});
app.listen(3000, () => console.log('Server running on port 3000'));
