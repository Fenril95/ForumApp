
app.controller('addQuestionController', ['$scope', '$rootScope', '$state', '$stateParams', 'userService', 'questionService', 'resourceService', function ($scope, $rootScope, $state, $stateParams, userService, questionService, resourceService) {
    $scope.userStatus = userService.userStatus;
    $scope.topic_id = $stateParams.topic_id;

    //Controls for questions
    $scope.question = {title: '', description: '', topic_id: $scope.topic_id, created_by: $scope.userStatus.currentUser};

    $scope.addQuestion = function () {
        questionService.createQuestion($scope.topic_id, $scope.question)
            .then(function success () {
                $state.go('topic', {topic_id: $scope.topic_id});
            }, function error () {
                $rootScope.error = resourceService.serverError;
            })
    }
}]);