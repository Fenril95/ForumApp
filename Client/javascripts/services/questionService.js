app.service('questionService', ['$http', function ($http) {
    var baseUrl = 'api/v1/topics/';
    var questions;

    this.getQuestions = function (topic_id) {
        return $http.get(baseUrl + topic_id + '/questions');
    };

    this.getQuestionById = function (topic_id, question_id) {
      return $http.get(baseUrl + topic_id + '/questions/' + question_id);
    };

    this.createQuestion = function (topic_id, questionData) {
        return $http.post(baseUrl + topic_id + '/questions', questionData)
    };

    this.modifyQuestion = function (topic_id, question_id, questionData) {
        return $http.put(baseUrl + topic_id + '/questions/' + question_id, questionData);
    };

    this.moveQuestion = function (topic_id, question_id, newTopic_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/move/' + newTopic_id)
    };

    this.removeQuestion = function (topic_id, question_id) {
        return $http.delete(baseUrl + topic_id + '/questions/' + question_id);
    };



    this.getQuestionIndex = function (question_id) {
        return this.questions.findIndex(function (element) {
            return element ? element._id === question_id : null;
        });
    };
}]);
