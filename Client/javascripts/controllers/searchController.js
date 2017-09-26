app.controller('searchController', ['$scope', '$rootScope', '$stateParams', 'searchService', 'resourceService', function ($scope, $rootScope, $stateParams, searchService, resourceService) {

    //variable that taakes data from service, or when yo reload the same page - from url
    var searchString = searchService.searchString || $stateParams.search_data;

    //Search
    searchService.doSearch(searchString)
        .then(function success(res) {
            $scope.topics = res.data.topics;
            $scope.questions = res.data.questions;
            $scope.comments = res.data.comments;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });
}]);
