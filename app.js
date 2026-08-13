const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);



// 404 - لازم يكون آخر شي





app.use((req, res) => {
 res.status(404).render('404');
});
app.listen(3000, () => console.log('Server running on port 3000'));