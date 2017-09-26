app.service('topicService', ['$http', function ($http) {
    var baseUrl = 'api/v1/topics/';
    var topics;

    this.getTopicIndex = function (topic_id) {
        return this.topics.findIndex(function (element) {
            return element ? element._id === topic_id : null;
        })
    };


    this.getTopics = function () {
        return $http.get(baseUrl);
    };

    this.createTopic = function (topicData) {
        return $http.post(baseUrl, topicData);
    };

    this.modifyTopic = function (topic_id, topicData) {
        return $http.put(baseUrl + topic_id, topicData);
    };

    this.removeTopic = function (topic_id) {
        return $http.delete(baseUrl + topic_id);
    };
}]);
