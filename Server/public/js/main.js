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
app.service('commentService', ['$http', function ($http) {
    var baseUrl = 'api/v1/topics/';
    var comments;

    this.getCommentIndex = function (comment_id) {
        return this.comments.findIndex(function (element) {
           return element ? element._id === comment_id : null;
        })
    };


    this.getComments = function (topic_id, question_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/comments');
    };

    this.createComment = function (topic_id, question_id, commentData) {
        return $http.post(baseUrl + topic_id + '/questions/' + question_id + '/comments', commentData);
    };

    this.removeComment = function (topic_id, question_id, comment_id) {
        return $http.delete(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id);
    };

    this.markAsImportant = function (topic_id, question_id, comment_id, data) {
        return $http.put(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/important', data);
    };

    this.markAsUnimportant = function (topic_id, question_id, comment_id, data) {
        return $http.put(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/not-important', data);
    };

    this.upVote = function (topic_id, question_id, comment_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/upvote');
    };

    this.downVote = function (topic_id, question_id, comment_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/downvote');
    };

    this.removeVote = function (topic_id, question_id, comment_id, comment) {
        return $http.post(baseUrl + topic_id + '/questions/' + question_id + '/comments/' + comment_id + '/remove-vote', comment);
    }
}]);
app.service('questionService', ['$http', function ($http) {
    var baseUrl = 'api/v1/topics/';
    var questions;

    this.getQuestions = function (topic_id) {
        return $http.get(baseUrl + topic_id + '/questions');
    };

    this.getQuestionById = function (topic_id, question_id) {
      return $http.get(baseUrl + topic_id + '/questions/' + question_id);
    };

    this.createQuestion = function (topic_id, questionData) {
        return $http.post(baseUrl + topic_id + '/questions', questionData)
    };

    this.modifyQuestion = function (topic_id, question_id, questionData) {
        return $http.put(baseUrl + topic_id + '/questions/' + question_id, questionData);
    };

    this.moveQuestion = function (topic_id, question_id, newTopic_id) {
        return $http.get(baseUrl + topic_id + '/questions/' + question_id + '/move/' + newTopic_id)
    };

    this.removeQuestion = function (topic_id, question_id) {
        return $http.delete(baseUrl + topic_id + '/questions/' + question_id);
    };



    this.getQuestionIndex = function (question_id) {
        return this.questions.findIndex(function (element) {
            return element ? element._id === question_id : null;
        });
    };
}]);

app.service('resourceService', [function () {
    this.authSuccess = 'You\'ve been successfully registrated, now you can login with your username and password';
    this.serverError = 'Ooops:( Something happened to server, it is not your fault, but please, can you reload this page one more time?';
}]);
app.service('searchService', ['$http', function ($http) {
    var baseUrl = 'api/v1/search/';

    this.doSearch = function (data) {
         return $http.get(baseUrl + data);
    }
}]);

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

app.factory('helperFactory', [function () {
    var obj = {};

    obj.checkTime = function (created_at) {
        return (new Date().getTime()) - (new Date(created_at).getTime());
    };

    return obj;
}]);


app.controller('addQuestionController', ['$scope', '$rootScope', '$state', '$stateParams', 'userService', 'questionService', 'resourceService', function ($scope, $rootScope, $state, $stateParams, userService, questionService, resourceService) {
    $scope.userStatus = userService.userStatus;
    $scope.topic_id = $stateParams.topic_id;

    //Controls for questions
    $scope.question = {title: '', description: '', topic_id: $scope.topic_id, created_by: $scope.userStatus.currentUser};

    $scope.addQuestion = function () {
        questionService.createQuestion($scope.topic_id, $scope.question)
            .then(function success () {
                $state.go('topic', {topic_id: $scope.topic_id});
            }, function error () {
                $rootScope.error = resourceService.serverError;
            })
    }
}]);
app.controller('addTopicController', ['$scope', '$rootScope', '$state', 'userService', 'topicService', 'resourceService', function ($scope, $rootScope, $state, userService, topicService, resourceService) {

    //Pre-config for adding template
    $scope.userStatus = userService.userStatus;

    //Controls for Topics
    $scope.topic = {header: '', description: '', created_by: $scope.userStatus.currentUser};

    $scope.addTopic = function () {
        topicService.createTopic($scope.topic)
            .then(function success(res) {
                topicService.topics.push(res.data);
                $state.go('home');
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

}]);

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

app.controller('mainController', ['$scope', '$rootScope', '$state', 'topicService', 'userService', 'searchService', 'resourceService', function ($scope, $rootScope, $state, topicService, userService, searchService, resourceService) {

    //Pre-config variables
    $scope.userStatus = userService.userStatus;
    $scope.topics = topicService.topics;
    $scope.editedTopic = {header: '', description: '', id: ''};
    //search mechanism
    $scope.search = {search: ''};


    $scope.deleteTopic = function (topic_id) {
        topicService.removeTopic(topic_id)
            .then(function success() {

                var index = topicService.getTopicIndex(topic_id);

                topicService.topics.splice(index, 1);
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    //Taking topic data, and prepare it for particular editing
    $scope.grabData = function (topic_id) {
        var topicID = topic_id;

        var topic = $scope.topics.filter(function (topic) {
            return topic._id ? topic._id === topicID : null;
        });

        $scope.editedTopic.header = topic[0].header;
        $scope.editedTopic.description = topic[0].description;
        $scope.editedTopic.id = topic[0]._id;
    };

    $scope.editTopic = function () {
        topicService.modifyTopic($scope.editedTopic.id, $scope.editedTopic)
            .then(function success() {

                angular.element('#modal').modal('toggle');

                var index = topicService.getTopicIndex($scope.editedTopic.id);

                topicService.topics[index].header = $scope.editedTopic.header;
                topicService.topics[index].description = $scope.editedTopic.description;
                topicService.topics[index]._id = $scope.editedTopic.id;

                $scope.editedTopic.header = '';
                $scope.editedTopic.description = '';
                $scope.editedTopic.id = '';

            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    //pass search data to service and go to search state
    $scope.submitSearch = function () {
        searchService.searchString = $scope.search.search;
        $state.go('search', {search_data: $scope.search.search});
        $scope.search = {search: ''};

    }

}]);

app.controller('questionController', ['$scope', '$rootScope', '$stateParams', '$state', 'userService', 'questionService', 'commentService', 'resourceService', 'helperFactory', function ($scope, $rootScope, $stateParams, $state, userService, questionService, commentService, resourceService, helperFactory) {

    //local variables
    var topic_id = $stateParams.topic_id;
    var question_id = $stateParams.question_id;
    var comment_id = '';

    //Config variables and array/object that contains data to render
    $scope.userStatus = userService.userStatus;
    $scope.isAuthor = false;
    $scope.canChange = true;
    $scope.hasImportant = false;
    $scope.commentPerPage = '';
    $scope.arrLength = '';
    $scope.question = '';
    $scope.comments = commentService.comments || [];
    $scope.comment = {content: '', question_id: question_id, created_by: $scope.userStatus.currentUser};
    $scope.quoteComment = '';
    $scope.originalAuthor = '';


    questionService.getQuestionById(topic_id, question_id)
        .then(function success(res) {
            $scope.question = res.data;

            // Check if user is author of the question
            if ($scope.question.user_id === $scope.userStatus.user_id) {
                $scope.isAuthor = true;
            }

            //Check if user can edit his question
            var time = Math.floor((helperFactory.checkTime(res.data.created_at) / 1000) / 60);
            $scope.canChange = time < 5;

        }, function error() {
            $rootScope.error = resourceService.serverError;
        });

    //get comments
    commentService.getComments(topic_id, question_id)
        .then(function success(res) {
            //Save comments to service
            commentService.comments = res.data;
            $scope.comments = commentService.comments;
            $scope.arrLength = res.data.length;

            //Check if already have some comment marked as important
            var result = $scope.comments.filter(function (element) {
                return element && element.isImportant === true;
            });

            $scope.hasImportant = result.length !== 0;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });

    //ui-sref in controller
    $scope.goToTopics = function () {
        $state.go('topic', {topic_id: topic_id});
    };

    //Edit question by user
    $scope.editQuestion = function () {
        questionService.modifyQuestion(topic_id, question_id, $scope.question)
            .then(function success() {
                angular.element('#modal').modal('toggle');
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


    //Controls for adding comment
    $scope.addComment = function () {
        $scope.comment.quote = $scope.quoteComment;
        $scope.comment.quoteAuthor = $scope.quoteAuthor;

        commentService.createComment(topic_id, question_id, $scope.comment)
            .then(function success(res) {
                $scope.comment = {
                    content: '',
                    question_id: question_id,
                    created_by: $scope.userStatus.currentUser,
                    quote: '',
                    quoteAuthor: ''
                };
                commentService.comments.push(res.data);

                $scope.clearQuote();
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


    //Visualizing quote near the comment form
    $scope.quote = function (comment) {
        //check if quote button triggered on comment, or o question
        if (comment.content) {
            $scope.quoteComment = comment.content;
            $scope.quoteAuthor = comment.created_by;
        } else if (comment.description) {
            $scope.quoteComment = comment.description;
            $scope.quoteAuthor = comment.created_by;
        }
    };

    //clear quote field
    $scope.clearQuote = function () {
        $scope.quoteComment = '';
        $scope.quoteAuthor = '';
    };

    //Delete comment
    $scope.deleteComment = function (comment_id) {
        commentService.removeComment(topic_id, question_id, comment_id)
            .then(function success() {
                var index = commentService.getCommentIndex(comment_id);

                commentService.comments.splice(index, 1);
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


    //Make comment important
    $scope.makeImportant = function (commentId, state) {
        comment_id = commentId;
        $scope.hasImportant = state;
        var obj = {isImportant: state};
        commentService.markAsImportant(topic_id, question_id, comment_id, obj)
            .then(function success(res) {
                var index = commentService.getCommentIndex(comment_id);

                $scope.comments[index].isImportant = res.data.isImportant;
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    //Comment rating
    $scope.upvote = function (commentId) {
        comment_id = commentId;
        commentService.upVote(topic_id, question_id, comment_id)
            .then(function success() {
                var index = commentService.getCommentIndex(comment_id);

                commentService.comments[index].rating += 1;
                commentService.comments[index].userRatingAction = 1;

                comment_id = '';
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    $scope.downvote = function (commentId) {
        comment_id = commentId;
        commentService.downVote(topic_id, question_id, comment_id)
            .then(function success() {
                var index = commentService.getCommentIndex(comment_id);

                commentService.comments[index].rating -= 1;
                commentService.comments[index].userRatingAction = -1;
                comment_id = '';
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


    //Set user voteStae to 0, so he can again vote + or -
    $scope.eraseVote = function (comment) {
        comment_id = comment._id;

        commentService.removeVote(topic_id, question_id, comment_id, comment)
            .then(function success() {
                var index = commentService.getCommentIndex(comment_id);

                //Check user voteState before triggering eraseVote();
                if (commentService.comments[index].userRatingAction === 1) {
                    commentService.comments[index].rating -= 1;
                } else if (commentService.comments[index].userRatingAction === -1) {
                    commentService.comments[index].rating += 1;
                }

                commentService.comments[index].userRatingAction = 0;
                comment_id = '';
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    }

}]);

app.controller('searchController', ['$scope', '$rootScope', '$stateParams', 'searchService', 'resourceService', function ($scope, $rootScope, $stateParams, searchService, resourceService) {

    //variable that taakes data from service, or when yo reload the same page - from url
    var searchString = searchService.searchString || $stateParams.search_data;

    //Search
    searchService.doSearch(searchString)
        .then(function success(res) {
            $scope.topics = res.data.topics;
            $scope.questions = res.data.questions;
            $scope.comments = res.data.comments;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });
}]);

app.controller('topicController', ['$scope', '$rootScope', '$state', '$stateParams', 'userService', 'topicService', 'questionService', 'resourceService', function ($scope, $rootScope, $state, $stateParams, userService, topicService, questionService, resourceService) {

    //local variables
    var topic_id = $stateParams.topic_id;
    var question_id = '';
    var newTopic_id = '';

    //pre-config variables
    $scope.error = '';
    $scope.topicPerPage = '';
    $scope.arrLength = '';
    $scope.userStatus = userService.userStatus;
    $scope.questions = questionService.questions;
    //Contains all topics except one we are already in
    $scope.topics = topicService.topics.filter(function (element) {
        return element ? element._id !== topic_id : null;
    });
    $scope.editedQuestion = {title: '', description: '', id: ''};

    //rendering questions
    questionService.getQuestions(topic_id)
        .then(function success(res) {
            questionService.questions = res.data;
            $scope.questions = questionService.questions;
            $scope.arrLength = $scope.questions.length;
        }, function error() {
            $rootScope.error = resourceService.serverError;
        });


    //ui-sref in controller
    $scope.askQuestion = function () {
        $state.go('addQuestion', {topic_id: topic_id})
    };

    //Deleting question
    $scope.deleteQuestion = function (question_id) {
        questionService.removeQuestion(topic_id, question_id)
            .then(function success() {
                var index = questionService.getQuestionIndex(question_id);

                questionService.questions.splice(index, 1);
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };

    // Controls for editing question
    // Function that takes question id and prepare it for submiting
    $scope.grabData = function (questionIid) {
        var questionID = questionIid;

        var question = $scope.questions.filter(function (question) {
            return question._id ? question._id === questionID : null;
        });

        $scope.editedQuestion.title = question[0].title;
        $scope.editedQuestion.description = question[0].description;
        $scope.editedQuestion.id = question[0]._id;
        question_id = question[0]._id;


    };

    //Particular editing
    $scope.editQuestion = function () {
        questionService.modifyQuestion(topic_id, question_id, $scope.editedQuestion)
            .then(function success(res) {
                var index = questionService.getQuestionIndex($scope.editedQuestion.id);

                questionService.questions[index].title = res.data.title;
                questionService.questions[index].description = res.data.description;

                $scope.editedQuestion.title = '';
                $scope.editedQuestion.description = '';
                $scope.editedQuestion.id = '';

                angular.element('#modal').modal('toggle');
            })
    };


    $scope.takeData = function (questionId) {
        question_id = questionId;
    };

    //Moving question to another topic
    $scope.moveQuestion = function (newtopic_id) {
        newTopic_id = newtopic_id;

        questionService.moveQuestion(topic_id, question_id, newTopic_id)
            .then(function success() {
                angular.element('#modal1').modal('toggle');

                topic_id = '';
                question_id = '';
                newTopic_id = '';

                $state.go('home');
            }, function error() {
                $rootScope.error = resourceService.serverError;
            });
    };


}]);
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
