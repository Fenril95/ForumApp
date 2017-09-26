app.controller('userListController', ['$scope', '$rootScope', 'userService', 'resourceService', function ($scope, $rootScope, userService, resourceService) {
    //pre-config variables
    $scope.users = userService.users || [];
    $scope.userSearch = '';
    $scope.userState = {banState: false};

    //get and render users
    userService.getUsers()
        .then(function success(res) {
            userService.users = res.data;
            $scope.users = userService.users;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });

    //Function that triggers ban/unban user state
    $scope.banUser = function (user_id, state) {
        var index = userService.getUserIndex(user_id);
        $scope.userState.banState = state;

        userService.modifyUser(user_id, $scope.userState)
            .then(function (res) {
                userService.users[index].isBanned = res.data.isBanned;
                $scope.userState.banState = state;

            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

}]);
