app.controller('mainController', ['$scope', '$rootScope', '$state', 'topicService', 'userService', 'searchService', 'resourceService', function ($scope, $rootScope, $state, topicService, userService, searchService, resourceService) {

    //Pre-config variables
    $scope.userStatus = userService.userStatus;
    $scope.topics = topicService.topics;
    $scope.editedTopic = {header: '', description: '', id: ''};
    //search mechanism
    $scope.search = {search: ''};


    $scope.deleteTopic = function (topic_id) {
        topicService.removeTopic(topic_id)
            .then(function success() {

                var index = topicService.getTopicIndex(topic_id);

                topicService.topics.splice(index, 1);
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    //Taking topic data, and prepare it for particular editing
    $scope.grabData = function (topic_id) {
        var topicID = topic_id;

        var topic = $scope.topics.filter(function (topic) {
            return topic._id ? topic._id === topicID : null;
        });

        $scope.editedTopic.header = topic[0].header;
        $scope.editedTopic.description = topic[0].description;
        $scope.editedTopic.id = topic[0]._id;
    };

    $scope.editTopic = function () {
        topicService.modifyTopic($scope.editedTopic.id, $scope.editedTopic)
            .then(function success() {

                angular.element('#modal').modal('toggle');

                var index = topicService.getTopicIndex($scope.editedTopic.id);

                topicService.topics[index].header = $scope.editedTopic.header;
                topicService.topics[index].description = $scope.editedTopic.description;
                topicService.topics[index]._id = $scope.editedTopic.id;

                $scope.editedTopic.header = '';
                $scope.editedTopic.description = '';
                $scope.editedTopic.id = '';

            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    //pass search data to service and go to search state
    $scope.submitSearch = function () {
        searchService.searchString = $scope.search.search;
        $state.go('search', {search_data: $scope.search.search});
        $scope.search = {search: ''};

    }

}]);
