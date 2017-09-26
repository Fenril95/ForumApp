app.service('commentService', ['$http', function ($http) {
    var baseUrl = 'api/v1/topics/';
    var comments;

    this.getCommentIndex = function (comment_id) {
        return this.comments.findIndex(function (element) {
           return element ? element._id === comment_id : null;
        })
    };


    this.getComments = function (topic_id, question_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/comments');
    };

    this.createComment = function (topic_id, question_id, commentData) {
        return $http.post(baseUrl + topic_id + '/questions/' + question_id + '/comments', commentData);
    };

    this.removeComment = function (topic_id, question_id, comment_id) {
        return $http.delete(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id);
    };

    this.markAsImportant = function (topic_id, question_id, comment_id, data) {
        return $http.put(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/important', data);
    };

    this.markAsUnimportant = function (topic_id, question_id, comment_id, data) {
        return $http.put(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/not-important', data);
    };

    this.upVote = function (topic_id, question_id, comment_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/upvote');
    };

    this.downVote = function (topic_id, question_id, comment_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/downvote');
    };

    this.removeVote = function (topic_id, question_id, comment_id, comment) {
        return $http.post(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/remove-vote', comment);
    }
}]);