var mongoose = require('mongoose');
var User = mongoose.model('User');

var bCrypt = require('bcrypt-nodejs');
var fs = require('fs');

module.exports = (function () {

    return {
        //Send user status to handle client session
        loginStatus: function (req, res) {
            var user = {state: 'success', user: req.user ? req.user : null};

            if(user.user === null) {
                res.send({message: 'You are not logged in'});
            } else {
                res.json(user);
            }
        },

        logout: function (req, res) {
            req.logout();
            res.redirect('/');
        },

        authfailure: function (req, res) {
            res.send({state: 'failure', user: null, message: "Invalid username or password"});
        },

        authSuccess: function (req, res) {
            res.send({state: 'success', user: req.user ? req.user : null});
        },

        getAllUsers: function (req, res) {
            User.find({}, function (err, user) {
                if(err) {
                    res.send(err);
                }

                res.json(user);
            })
        },

        modifyUser: function (req, res) {
            User.findById(req.params.user_id, function (err, currentUser) {
                if(err) {
                    res.send(err);
                }

                currentUser.isBanned = req.body.banState;

                currentUser.save(function (err, user) {
                    if(err) {
                        return res.send(err);
                    }

                    return res.json(user);
                })
            })
        },

        //Login
        getUser: function (req, username, password, done) {
            // check in mongo if a user with username exists or not
                User.findOne({ 'username' :  username }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            console.log('User Not Found with username '+username);
                            return done(null, false);
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(user, password)){
                            console.log('Invalid Password');
                            return done(null, false); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    }
                );
        },

        //Sign Up
        saveUser: function(req, res) {
            console.log('hi');
            // find a user in mongoDB with provided username
            User.findOne({ 'username' :  req.body.username }, function(err, user) {
                // In case of any error, return using the done method
                if (err){
                    console.log('Error in SignUp: '+err);
                    res.send(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists with username');
                    res.send('User already exists with username')
                } else {
                    console.log(req.body);
                    // if there is no user, create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = req.body.username;
                    newUser.password = createHash(req.body.password);
                    newUser.email = req.body.email;
                    if(!req.body.imgFile) {
                        newUser.imageURL = '/img/user-images/default-image.jpg';
                    }

                    //Assign user as Admin
                    if(req.body.role) {
                        newUser.role = req.body.role;
                    }

                    // save the user
                    newUser.save(function(err, user) {
                        if (err){
                            console.log('Error in Saving user: '+err);
                            return res.send(err);
                        }

                        if(req.body.imgFile) {
                            //Get image bufferized;
                            console.log(req.body.imgFile);
                            var imageBuffer = new Buffer(req.body.imgFile.base64, 'base64');
                            var filetype = req.body.imgFile.filetype.split('/')[1];
                            fs.writeFile(__dirname + '/../../public/img/user-images/' + user._id + '.' + filetype, imageBuffer, 'binary', function(err) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("The file was saved!");
                                }
                            });
                            User.update({_id: user._id}, {$set: {imageURL: '/img/user-images/' + user._id + '.' + filetype}}, function (err) {
                                if(err) {
                                    res.send(err)
                                }
                            });
                        }


                        console.log(newUser.username + ' Registration successful');
                        return res.json({state: 'success', user: user});
                    });
                }
            });
        }
    }
})();

    //--Helper Functions

//Comparing hashed passwords
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

// Generates hash
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};