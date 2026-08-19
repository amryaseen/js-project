const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(session({
 secret: 'book-exchange-secret',
 resave: false,
 saveUninitialized: false
}));
app.use((req, res, next) => {
 res.locals.user = req.session.user || null;
 res.locals.theme = req.cookies.theme || 'light';
 res.locals.language = req.cookies.language || 'en';
 res.locals.t=require(`./lang/${res.locals.language}`)
 next();
});
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);



// 404 - لازم يكون آخر شي





app.use((req, res) => {
 res.status(404).render('404');
});
app.listen(3000, () => console.log('Server running on port 3000'));
