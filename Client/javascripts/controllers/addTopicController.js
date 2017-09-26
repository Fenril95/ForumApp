app.controller('addTopicController', ['$scope', '$rootScope', '$state', 'userService', 'topicService', 'resourceService', function ($scope, $rootScope, $state, userService, topicService, resourceService) {

    //Pre-config for adding template
    $scope.userStatus = userService.userStatus;

    //Controls for Topics
    $scope.topic = {header: '', description: '', created_by: $scope.userStatus.currentUser};

    $scope.addTopic = function () {
        topicService.createTopic($scope.topic)
            .then(function success(res) {
                topicService.topics.push(res.data);
                $state.go('home');
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

}]);
