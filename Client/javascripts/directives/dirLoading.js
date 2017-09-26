app.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            scope.isLoading = function () {
                // console.log('klmsgsggs');
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (value) {

                if(value) {
                    elem.show();
                }  else {
                    elem.hide();
                }
            });
        }

    }
}]);
