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
