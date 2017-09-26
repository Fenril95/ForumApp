app.service('userService', ['$http',  function ($http) {
    //Service serve for making any interactions with user or it's data.
    var baseUrl = 'api/v1/users/';
    var users;
    var userStatus;

    this.getUserIndex = function (user_id) {
        return this.users.findIndex(function (element) {
            return element ? element._id === user_id : null;
        })
    };

    this.setUserData = function (obj) {
        this.userStatus = {
            authenticated: obj.authenticated || '',
            currentUser: obj.currentUser || '',
            user_id: obj.user_id || '',
            role: obj.role || '',
            isBanned: obj.isBanned || ''
        };
    };

    this.getUsers = function () {
        return $http.get(baseUrl);
    };

    this.modifyUser = function (user_id, userData) {
        return $http.put(baseUrl + user_id, userData);
    };

}]);
