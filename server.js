"use strict";
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;
let mongoose = require('mongoose');
let passport = require('passport');
require('./models/user');
require('./models/icon');
require('./models/comment');
require('./config/passport');
mongoose.connect('mongodb://localhost/iconograph');


app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.use(express.static('./public'));
app.use(express.static('./bower_components'));
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

let userRoutes = require('./routes/userRoutes');
let iconRoutes = require('./routes/iconRoutes');
let commentRoutes = require('./routes/commentRoutes');

app.get('/', function(req, res) {
	res.render('index');
});

app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/icons/', iconRoutes);
app.use('/api/v1/comments/', commentRoutes);

app.use((err, req, res, next) => {
	res.status(500).send(err);
});

module.exports = app.listen(port, () => {
	console.log('Example app listening at http://localhost:' + port);
});
