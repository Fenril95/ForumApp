var express = require('express');
var router = express.Router();

//-Controllers
var topics = require('../config/controllers/topics.js');
var questions = require('../config/controllers/questions.js');
var users = require('../config/controllers/users.js');
var comments = require('../config/controllers/comments.js');
var rating = require('../config/controllers/rating.js');
var search = require('../config/controllers/search.js');

module.exports = function(passport){

    // ----------------Routes for Auth------------

    //sends user auth status to handle client session
    router.get('/auth/status', function (req, res) {
        users.loginStatus(req, res);
    });

    //sends successful login state back to angular
    router.get('/auth/success', function(req, res){
        users.authSuccess(req, res);
    });

    //sends failure login state back to angular
    router.get('/auth/failure', function(req, res){
        users.authfailure(req, res);
    });

    //log in
    router.post('/auth/login', passport.authenticate('login', {
        successRedirect: '/api/v1/auth/success',
        failureRedirect: '/api/v1/auth/failure'
    }));

    //sign up
    router.post('/auth/signup', function (req, res) {
       users.saveUser(req, res);
    });

    //log out
    router.get('/auth/signout', function(req, res) {
        users.logout(req, res);
    });

    //get user list
    router.get('/users', function (req, res) {
       users.getAllUsers(req, res);
    });

    //change user info (for now uses only for bans)
    router.put('/users/:user_id', function (req, res) {
       users.modifyUser(req, res);
    });

    // ---------------------------search-------------------------

    router.get('/search/:search_data', function (req, res) {
       search.search(req, res);
    });

    //    ----------------------Routes for Topics-----------------

    router.route('/topics')

        .get(function (req, res){
            topics.getAllTopics(req, res);
        })

        .post(function (req, res) {
            topics.addTopic(req, res)
        })

        .delete(function (req, res) {
            topics.removeAllTopics(req, res);
        });


    router.route('/topics/:topic_id')

        .get(function (req, res) {
            topics.getTopicById(req, res);
        })

        .put(function (req, res) {
            topics.modifyTopic(req, res);
        })


        .delete(function (req, res) {
            topics.deleteTopicById(req, res)
        });


//--------Routes for Questions

    router.route('/topics/:topic_id/questions')
        .get(function (req, res) {
            questions.getQuestionsByTopicId(req, res);
        })

        .post(function (req, res) {
            questions.addQuestion(req, res);
        })

        .delete(function (req, res) {
            questions.deleteAllQuestions(req, res);
        });


    router.route('/topics/:topic_id/questions/:question_id')

        .get(function (req, res) {
            questions.getQuestionById(req, res);
        })

        .put(function (req, res) {
            questions.modifyQuestion(req, res);
        })

        .delete(function (req, res) {
            questions.deleteQuestionById(req, res);
        });

    //Move question to another topic
    router.get('/topics/:topic_id/questions/:question_id/move/:newTopic_id', function (req, res) {
        questions.moveQuestion(req, res);
    });



    //--------------Routes for comments


    router.route('/topics/:topic_id/questions/:question_id/comments')

        .get(function (req, res) {
            comments.getCommentsByQuestionId(req, res);
        })

        .post(function (req, res) {
            comments.postComment(req, res);
        })

        .delete(function (req, res) {
            comments.deleteAllComments(req, res);
        });


    router.route('/topics/:topic_id/questions/:question_id/comments/:comment_id')

        .get(function (req, res) {
            comments.getCommentById(req, res);
        })

        .put(function (req, res) {
            comments.modifyComment(req, res);
        })

        .delete(function (req, res) {
            comments.deleteCommentById(req, res);
        });

    //Mark as important
    router.put('/topics/:topic_id/questions/:question_id/comments/:comment_id/important', function (req, res) {
       comments.markAsImportant(req, res);
    });

    //Unmark as important
    router.put('/topics/:topic_id/questions/:question_id/comments/:comment_id/not-important', function (req, res) {
        comments.markAsUnimportant(req, res);
    });

    //Up Vote
    router.get('/topics/:topic_id/questions/:question_id/comments/:comment_id/upvote', function (req, res) {
       rating.upVote(req, res);
    });

    //Down vote
    router.get('/topics/:topic_id/questions/:question_id/comments/:comment_id/downvote', function (req, res) {
        rating.downVote(req, res);
    });

    router.post('/topics/:topic_id/questions/:question_id/comments/:comment_id/remove-vote', function (req, res) {
        rating.removeVote(req, res);
    });

    return router;

};


