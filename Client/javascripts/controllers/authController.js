app.controller('authController', ['$scope', '$rootScope', '$state', 'userService', 'authService', 'resourceService', function ($scope, $rootScope, $state, userService, authService, resourceService) {

    //Object for delivering user data to Service
    $scope.user = {username: '', password: '', email: '', imgFile: ''};
    $scope.error = '';
    $scope.message = '';

    //signup user
    $scope.register = function () {
        authService.user = $scope.user;
        authService.signupUser()
            .then(function success(res) {

                if (res.data.state === 'success') {

                    $scope.user = {username: '', password: '', email: '', imgFile: null};
                    $scope.message = resourceService.authSuccess;

                } else {
                    $scope.error = res.data.message;
                }
            }, function error() {
                $rootScope.error = resourceService.serverError;
            })
    };

    //login user
    $scope.login = function () {
        authService.user = $scope.user;
        authService.loginUser()
            .then(function success(res) {

                if (res.data.state === 'success') {
                    $scope.error = '';

                    var obj = {
                        authenticated: true,
                        currentUser: res.data.user.username,
                        user_id: res.data.user._id,
                        role: res.data.user.role,
                        isBanned: res.data.user.isBanned
                    };

                    //pass user status to service
                    userService.setUserData(obj);
                    //pass user status to parent scope
                    $scope.setUserValues(obj);
                    $scope.userStatus = userService.userStatus;

                    $state.go('home');
                }
                else {
                    $scope.error = res.data.message;
                }
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


}]);