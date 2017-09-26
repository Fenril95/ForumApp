// //Service consider to deal with registration/authorization process

app.service('authService', ['$http', function ($http) {
    var baseUrl = 'api/v1/auth/';
    var user;

    this.signupUser = function () {
        return $http.post(baseUrl + 'signup', this.user);
    };

    this.loginUser = function () {
        return $http.post(baseUrl + 'login', this.user);
    };

    this.isLoggedIn = function () {
        return $http.get(baseUrl + 'status');
    };

    this.logout = function () {
        return $http.get(baseUrl + 'signout');
    }
}]);