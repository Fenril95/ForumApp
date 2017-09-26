var mongoose = require('mongoose');

var Rating = mongoose.model('Rating');
var Comment = mongoose.model('Comment');

module.exports = (function () {

    return {

        upVote: function (req, res) {
            Rating.findOne({user_id: req.user._id, comment_id: req.params.comment_id}, function (err, rating) {
               if(err) {
                   res.send(err);
               }

               if(rating !== null) {
                   rating.voteState = 1;

                   Comment.update({_id: req.params.comment_id}, {$inc: {rating: 1}}, function (err) {
                       if(err) {
                           res.send(err);
                       }
                   });

                   rating.save(function (err, rating) {
                       if(err) {
                           return res.send(err)
                       }

                       return res.send(rating);
                   })

               } else {

                   var vote = new Rating;

                   vote.comment_id = req.params.comment_id;
                   vote.user_id = req.user._id;
                   vote.question_id = req.params.question_id;
                   vote.voteState = 1;

                   Comment.update({_id: req.params.comment_id}, {$inc: {rating: 1}}, function (err) {
                       if(err) {
                           res.send(err);
                       }
                   });

                   vote.save(function (err, rating) {
                       if(err) {
                           return res.send(err)
                       }

                       return res.send(rating);
                   })
               }
             });
        },

        downVote: function (req, res) {
            Rating.findOne({user_id: req.user._id, comment_id: req.params.comment_id}, function (err, rating) {
                if (err) {
                    res.send(err);
                }

                if (rating !== null) {
                    rating.voteState = -1;
                    console.log('he');
                    Comment.update({_id: req.params.comment_id}, {$inc: {rating: -1}}, function (err) {
                        if(err) {
                            res.send(err);
                        }
                    });

                    rating.save(function (err) {
                        if (err) {
                            return res.send(err)
                        }

                        return res.send(rating);
                    });


                } else {

                    var vote = new Rating;

                    vote.comment_id = req.params.comment_id;
                    vote.user_id = req.user._id;
                    vote.question_id = req.params.question_id;
                    vote.voteState = -1;

                    Comment.update({_id: req.params.comment_id}, {$inc: {rating: -1}}, function (err) {
                        if(err) {
                            res.send(err);
                        }
                    });

                    vote.save(function (err, rating) {
                        if (err) {
                            return res.send(err)
                        }

                        return res.send(rating);
                    })
                }
            });
        },

        removeVote: function (req, res) {
            Rating.findOne({user_id: req.user._id, comment_id: req.params.comment_id}, function (err, rating) {
                if(err) {
                    res.send(err);
                }

                rating.voteState = 0;

                if(req.body.userRatingAction === 1) {
                    Comment.update({_id: req.params.comment_id}, {$inc: {rating: -1}}, function (err) {
                        if(err) {
                            res.send(err);
                        }
                    });
                } else if(req.body.userRatingAction === -1) {
                    Comment.update({_id: req.params.comment_id}, {$inc: {rating: 1}}, function (err) {
                        if(err) {
                            res.send(err);
                        }
                    });
                }

                rating.save(function (err, rating) {
                    if(err) {
                        return res.send(err)
                    }

                    return res.send(rating);
                })
            })
        }
    }

})();