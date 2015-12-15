"use strict";
require('dotenv').load();
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;
let helmet = require('helmet');
let mongoose = require('mongoose');
let passport = require('passport');
require('./models/user');
require('./models/icon');
require('./models/comment');
require('./config/passport');
mongoose.connect(process.env.MONGO_URI);
/* istanbul ignore next */


app.set('views', './views');
app.engine('.html', require('ejs').renderFile);

//use .dist here(instead of public) to use minified files:
app.use(express.static('./dist'));
app.use(express.static('./bower_components'));
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(helmet());

let userRoutes = require('./routes/userRoutes');
let iconRoutes = require('./routes/iconRoutes');
let commentRoutes = require('./routes/commentRoutes');

app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/icons/', iconRoutes);
app.use('/api/v1/comments/', commentRoutes);

app.use((err, req, res, next) => {
	res.status(500).send(err);
});

app.get('/*', function(req, res) {
	res.render('index');
});

module.exports = app.listen(port, () => {
	console.log('Example app listening at http://localhost:' + port);
});
