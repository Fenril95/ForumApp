var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

//initialize mongoose schemas
require('./models/user');
require('./models/topic');
require('./models/question');
require('./models/comment');
require('./models/rating');

//Initialize routing files
var index = require('./routes/index')(passport);

//initialize mongoose connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var app = express();

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/')));

app.use(session({
    secret: 'something interesting',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//initialize routes
app.use('/api/v1', index);


app.use(function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + '/public/' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Initialize Passport
var initPassport = require('./config/passport-init');
initPassport(passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(500).json({
            message: err.message,
            error: err
        })
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(500).json({
        message: err.message,
        error: err
    })
});


module.exports = app;