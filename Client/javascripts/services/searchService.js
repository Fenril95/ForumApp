app.service('searchService', ['$http', function ($http) {
    var baseUrl = 'api/v1/search/';

    this.doSearch = function (data) {
         return $http.get(baseUrl + data);
    }
}]);
