var mongoose = require('mongoose');

var Rating = mongoose.model('Rating');
var Comment = mongoose.model('Comment');
var Question = mongoose.model('Question');

module.exports = (function () {

    return {

        getCommentsByQuestionId: function (req, res) {
            var object = {comments: '', votes: ''};
            Comment.find({question_id: req.params.question_id}).exec()
                .then(function (comment) {
                    object.comments = comment;
                    var commentIds = comment.map(function (el) {
                        return el._id;
                    });
                    return Rating.find({comment_id: {$in: commentIds}}).exec()
                })
                .then(function (votes) {
                    object.votes = votes;
                    return object;
                })
                .then(function (result) {

                    if (req.user) {
                        //ser user state to comment document
                        calculateUserState(result.comments, result.votes, req.user);
                        return result;
                    }

                    else {
                        return result;
                    }
                })
                .then(function (result) {
                    res.send(result.comments);
                })
                .catch(function (err) {
                    res.send(err);
                })
        },

        postComment: function (req, res) {
            var comment = new Comment();

            comment.topic_id = req.params.topic_id;
            comment.content = req.body.content;
            comment.user_id = req.user._id;
            comment.question_id = req.params.question_id;
            comment.created_by = req.body.created_by;
            comment.user_img = req.user.imageURL;

            //Check if user add quote for his comment
            if (req.body.quote) {
                comment.quote = req.body.quote;
                comment.quoteAuthor = req.body.quoteAuthor;
            }

            comment.save(function (err, comment) {
                if (err) {
                    return res.send(err);
                }

                return res.json(comment);
            });
        },

        deleteAllComments: function (req, res) {
            Comment.remove({}, function (err) {
                if (err) {
                    res.send(err);
                }

                res.json({message: 'All comments has been deleted'});
            })
        },

        getCommentById: function (req, res) {
            Comment.findById({_id: req.params.comment_id}, function (err, comment) {
                if (err) {
                    res.send(err)
                }

                res.json(comment);
            })
        },

        modifyComment: function (req, res) {
            Comment.findById({_id: req.params.comment_id}, function (err, comment) {
                if (err) {
                    res.send(err)
                }

                comment.content = req.body.content;

                comment.save(function (err, comment) {
                    if (err) {
                        return res.send(err);
                    }

                    return res.json(comment);
                })
            })
        },

        markAsImportant: function (req, res) {
            Comment.findById({_id: req.params.comment_id}, function (err, comment) {
                if (err) {
                    res.send(err);
                }

                comment.isImportant = req.body.isImportant;

                Question.update({_id: req.params.question_id}, {$set: {hasImportantAnswer: true}}, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });

                comment.save(function (err, comment) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(comment);
                })
            })
        },

        markAsUnimportant: function (req, res) {
            Comment.findById({_id: req.params.comment_id}, function (err, comment) {
                if (err) {
                    res.send(err);
                }

                comment.isImportant = req.body.isImportant;

                Question.update({_id: req.params.question_id}, {$set: {hasImportantAnswer: false}}, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });

                comment.save(function (err, comment) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(comment);
                })
            })
        },

        deleteCommentById: function (req, res) {
            Comment.remove({_id: req.params.comment_id}, function (err) {
                if (err) {
                    res.send(err);
                }

                Rating.remove({comment_id: req.params.comment_id}, function (err) {
                    if(err) {
                        res.send(err);
                    }

                    res.json({message: 'Comment wtih id ' + req.params.comment_id + ' has been deleted'})
                });

            })
        }

    }

})();


function calculateUserState(comments, votes, user) {
    for (var i = 0; i < comments.length; i++) {
        for (var j = 0; j < votes.length; j++) {
            if (comments[i]._id.toString() === votes[j].comment_id && votes[j].user_id === user._id.toString()) {
                if (votes[j].voteState === 1) {
                    comments[i].userRatingAction = 1;
                } else if (votes[j].voteState === -1) {
                    comments[i].userRatingAction = -1;
                } else {
                    comments[i].userRatingAction = 0;
                }
            }
        }
    }
}