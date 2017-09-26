var mongoose = require('mongoose');

var Topic = mongoose.model('Topic');
var Question = mongoose.model('Question');
var Comment = mongoose.model('Comment');

module.exports = (function() {

    return {

        search: function (req, res) {
            var query = req.params.search_data;
            var searchResults = {topics: [], questions: [], comments: []};

            Topic.find({header: {$regex: query, $options: 'i'}}, function (err, topic) {
                if(err) {
                    res.send(err);
                }

                searchResults.topics = topic;

                Question.find({title: {$regex: query, $options: 'i'}}, function (err, question) {
                    if(err) {
                        res.send(err);
                    }

                    searchResults.questions = question;

                    Comment.find({content: {$regex: query, $options: 'i'}}, function (err, comment) {
                        if(err) {
                            res.send(err);
                        }

                        searchResults.comments = comment;

                        res.send(searchResults);
                    });
                });
            });
        }

    }

})();

