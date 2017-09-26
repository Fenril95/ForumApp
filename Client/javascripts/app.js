var app = angular.module('app', ['ui.router', 'naif.base64', 'angularUtils.directives.dirPagination'])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "html/main.html",
                controller: 'mainController'
            })
            .state('login', {
                url: '/auth/login',
                templateUrl: "html/login.html",
                controller: 'authController'
            })
            .state('register', {
                url: '/auth/signup',
                templateUrl: "html/register.html",
                controller: 'authController'
            })
            .state('users', {
                url: '/users',
                templateUrl: "html/userList.html",
                controller: 'userListController'
            })
            .state('search', {
                url: '/search/:search_data',
                templateUrl: "html/search.html",
                controller: 'searchController'
            })
            .state('addTopic', {
                url: '/topics/addTopic',
                templateUrl: 'html/addTopic.html',
                controller: 'addTopicController'
            })
            .state('topic', {
                url: '/topics/:topic_id/questions',
                templateUrl: "html/topic.html",
                controller: 'topicController'
            })
            .state('question', {
                url:'/topics/:topic_id/questions/:question_id',
                templateUrl: 'html/question.html',
                controller: 'questionController'
            })
            .state('addQuestion', {
                url: '/topics/:topic_id/questions/addQuestion',
                templateUrl: 'html/addQuestion.html',
                controller: 'addQuestionController'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    }]);