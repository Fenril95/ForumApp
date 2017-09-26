var mongoose = require('mongoose');

var Topic = mongoose.model('Topic');
var Question = mongoose.model('Question');
var Comment = mongoose.model('Comment');
var Rating = mongoose.model('Rating');

module.exports = (function () {

    return {

        getAllTopics: function (req, res) {
            Topic.find(function (err, topics) {
                if(err) {
                    return res.send(500, err)
                }

                return res.send(topics);

            });
        },

        addTopic: function (req, res) {
            var topic = new Topic();

            topic.header = req.body.header;
            topic.description = req.body.description;
            topic.user_id = req.user._id;
            topic.created_by = req.body.created_by;

            topic.save(function (err, topic) {
                if(err) {
                    return res.send(500, err);
                }

                return res.json(topic);
            });
        },

        removeAllTopics: function (req, res) {
            Topic.remove({}, function (err) {
                if(err) {
                    console.log(err);
                }

                res.send('success');
            });
        },

        getTopicById: function (req, res) {
            Topic.findOne({_id: req.params.topic_id})
                .populate('questions')
                .exec(function (err, topic) {
                    if(err) {
                        res.send(err);
                    }

                    res.send(topic);
                });
        },

        modifyTopic: function (req, res) {
            Topic.findById(req.params.topic_id, function (err, topic) {
                if(err) {
                    res.send(err);
                }

                topic.header = req.body.header;
                topic.description = req.body.description;
                topic.modified_at = Date.now();

                topic.save(function (err, topic) {
                    if(err) {
                        return res.send(err);
                    }

                    return res.json(topic);
                })
            });
        },

        deleteTopicById: function (req ,res) {
            //Remove topic
            Topic.remove({_id: req.params.topic_id}, function(err) {
                if (err) {
                    res.send(err);
                }

                //Remove all questions within topic
                Question.remove({topic_id: req.params.topic_id}, function (err) {
                   if(err) {
                       res.send(err);
                   }

                   //Remove all comments within questions
                   Comment.remove({topic_id: req.params.topic_id}, function (err) {
                       if(err) {
                           res.send(err);
                       }

                        res.send('deleted');

                   })
                });

            });
        }


    }
})();