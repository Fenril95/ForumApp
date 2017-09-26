app.factory('helperFactory', [function () {
    var obj = {};

    obj.checkTime = function (created_at) {
        return (new Date().getTime()) - (new Date(created_at).getTime());
    };

    return obj;
}]);
