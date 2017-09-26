app.controller('topicController', ['$scope', '$rootScope', '$state', '$stateParams', 'userService', 'topicService', 'questionService', 'resourceService', function ($scope, $rootScope, $state, $stateParams, userService, topicService, questionService, resourceService) {

    //local variables
    var topic_id = $stateParams.topic_id;
    var question_id = '';
    var newTopic_id = '';

    //pre-config variables
    $scope.error = '';
    $scope.topicPerPage = '';
    $scope.arrLength = '';
    $scope.userStatus = userService.userStatus;
    $scope.questions = questionService.questions;
    //Contains all topics except one we are already in
    $scope.topics = topicService.topics.filter(function (element) {
        return element ? element._id !== topic_id : null;
    });
    $scope.editedQuestion = {title: '', description: '', id: ''};

    //rendering questions
    questionService.getQuestions(topic_id)
        .then(function success(res) {
            questionService.questions = res.data;
            $scope.questions = questionService.questions;
            $scope.arrLength = $scope.questions.length;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });


    //ui-sref in controller
    $scope.askQuestion = function () {
        $state.go('addQuestion', {topic_id: topic_id})
    };

    //Deleting question
    $scope.deleteQuestion = function (question_id) {
        questionService.removeQuestion(topic_id, question_id)
            .then(function success() {
                var index = questionService.getQuestionIndex(question_id);

                questionService.questions.splice(index, 1);
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    // Controls for editing question
    // Function that takes question id and prepare it for submiting
    $scope.grabData = function (questionIid) {
        var questionID = questionIid;

        var question = $scope.questions.filter(function (question) {
            return question._id ? question._id === questionID : null;
        });

        $scope.editedQuestion.title = question[0].title;
        $scope.editedQuestion.description = question[0].description;
        $scope.editedQuestion.id = question[0]._id;
        question_id = question[0]._id;


    };

    //Particular editing
    $scope.editQuestion = function () {
        questionService.modifyQuestion(topic_id, question_id, $scope.editedQuestion)
            .then(function success(res) {
                var index = questionService.getQuestionIndex($scope.editedQuestion.id);

                questionService.questions[index].title = res.data.title;
                questionService.questions[index].description = res.data.description;

                $scope.editedQuestion.title = '';
                $scope.editedQuestion.description = '';
                $scope.editedQuestion.id = '';

                angular.element('#modal').modal('toggle');
            })
    };


    $scope.takeData = function (questionId) {
        question_id = questionId;
    };

    //Moving question to another topic
    $scope.moveQuestion = function (newtopic_id) {
        newTopic_id = newtopic_id;

        questionService.moveQuestion(topic_id, question_id, newTopic_id)
            .then(function success() {
                angular.element('#modal1').modal('toggle');

                topic_id = '';
                question_id = '';
                newTopic_id = '';

                $state.go('home');
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


}]);