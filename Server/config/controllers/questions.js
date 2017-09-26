var mongoose = require('mongoose');

var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Comment = mongoose.model('Comment');



module.exports = (function () {

    return {

        getQuestionsByTopicId: function (req ,res) {
            Question.find({topic_id: req.params.topic_id}, function (err, question) {

                if(err) {
                    res.send(err);
                }
                res.json(question);
            });
        },

        addQuestion: function (req, res) {
            var question = new Question();

            question.title = req.body.title;
            question.description = req.body.description;
            question.created_by = req.body.created_by;
            question.topic_id = req.params.topic_id;
            question.user_id = req.user._id;
            question.created_by = req.body.created_by;
            question.user_img = req.user.imageURL;

            question.save(function (err, question) {
                if(err) {
                    return res.send(err);
                }

                return res.json(question);
            });
        },

        deleteAllQuestions: function (req, res) {
            Question.remove({}, function (err) {
                if(err) {
                    console.log(err);
                }

                res.send('success');
            });
        },

        getQuestionById: function (req, res) {
            Question.findById(req.params.question_id, function (err, question) {
                if(err) {
                    res.send(err);
                }

                res.send(question);
            })
        },

        modifyQuestion: function (req ,res) {
            Question.findById(req.params.question_id, function (err, question) {
                if(err) {
                    res.send(err);
                }

                question.title = req.body.title;
                question.description = req.body.description;
                question.modified_at = Date.now();

                question.save(function (err, topic) {
                    if(err) {
                        return res.send(err);
                    }

                    return res.json(topic);
                })
            });
        },

        moveQuestion: function (req, res) {
            Question.findById(req.params.question_id, function (err, currentQuestion) {
                if(err) {
                    res.send(err);
                }
                // console.log(req.data);
                currentQuestion.topic_id = req.params.newTopic_id;

                Comment.update({topic_id: req.params.topic_id},  {$set: {topic_id: req.params.newTopic_id}}, {multi:true}, function (err) {
                        if(err) {
                            res.send(err);
                        }
                    });


                currentQuestion.save(function (err, question) {
                    if(err) {
                        return res.send(err);
                    }

                    return res.json(question);
                });
          });
        },

        deleteQuestionById: function (req, res) {
            Question.remove({_id: req.params.question_id}, function(err) {
                if (err) {
                    res.send(err);
                }

                Comment.remove({question_id: req.params.question_id}, function (err) {
                    if(err) {
                        res.send(err);
                    }

                });

                res.json("deleted :(");
            });
        }

    }
})();
