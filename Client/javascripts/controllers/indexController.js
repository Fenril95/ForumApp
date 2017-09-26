app.controller('indexController', ['$scope', '$rootScope', 'userService', 'authService', 'topicService', 'resourceService', function ($scope, $rootScope, userService, authService, topicService, resourceService) {

    $rootScope.error = '';

    $scope.userStatus = {authenticated: false, currentUser: '', user_id: '', role: '', isBanned: ''};

    //method to set userStatus values from child scope
    $scope.setUserValues = function (obj) {
        $scope.userStatus = obj;
    };

    //get all topic
    topicService.getTopics()
        .then(function success(response) {
            topicService.topics = response.data;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });


    //Check if user is authorized
    authService.isLoggedIn()
        .then(function success(res) {
            if (res.data.state === 'success') {
                var successObj = {
                    authenticated: true,
                    currentUser: res.data.user.username,
                    user_id: res.data.user._id,
                    role: res.data.user.role,
                    isBanned: res.data.user.isBanned
                };
                //pass user status to service
                userService.setUserData(successObj);

                $scope.userStatus = userService.userStatus;
            } else {
                var obj = {authenticated: false, currentUser: '', user_id: '', role: '', isBanned: ''};
                userService.setUserData(obj);
                $scope.userStatus = userService.userStatus;
            }
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });


    $scope.signout = function () {
        var obj = {authenticated: false, currentUser: '', user_id: '', role: '', isBanned: ''};

        authService.logout();
        userService.setUserData(obj);
        $scope.userStatus = userService.userStatus;
    };


}]);
