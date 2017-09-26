var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

var users = require('./controllers/users.js');

module.exports = function (passport) {

    // serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user.username);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log('deserializing user:', user.username);
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },

        function (req, username, password, done) {
            users.getUser(req, username, password, done);
        }
    ));


};