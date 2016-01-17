app.directive('postForm', function(){
    return {
        restrict: 'E',
        scope: {
            userInfo: '='
        },
        templateUrl: 'directives/postForm/postForm.html',
        controller: function($scope, Posts, $routeParams, MyFirebaseHelper){
            $scope.topics = [];
            if ($routeParams.topicName){
                $scope.topics.push({value:$routeParams.topicName});    
            } 
            var ref = new Firebase("https://platfonechat.firebaseio.com/posts/");
            
             //The function that runs when the user saves a post
            $scope.savePost = function (post) {
                if (post.description && post.title && $scope.userInfo.isAuthenticated) {
                   
                    var postRef = ref.push();
                    console.log('postRef=', postRef);
                   
                    postRef.set({
                        author: $scope.userInfo.displayName,
                        title: post.title,
                        description: post.description,
                        profileImageUrl: $scope.userInfo.profileImageURL,
                        votes: 0,
                        topics: angular.copy($scope.topics),  // angular copy removes $$hashkey generated by angular
                        user: $scope.userInfo.userName,
                        timestamp: Firebase.ServerValue.TIMESTAMP
                    });
                    
                    // Resetting all the values
                    post.name = "";
                    post.description = "";
                    post.url = "";
                    post.title = "";
                    post.author = "";
                    //$scope.tags.length = 0;   // clears array more efficient
                    
                    $scope.topics.forEach(function(topic){
                      console.log('topic=', topic, ' postRef.key=', postRef.key());
                      MyFirebaseHelper.createTopicIfNotExists(
                        topic.value, 
                        postRef.key(),
                        {
                          postId: postRef.key(), 
                          timestamp: Firebase.ServerValue.TIMESTAMP
                        }
                      );
                    });
                      
                    $scope.topics.length = 0;
                } else {
                    //An alert to tell the user to log in or put something in all the fields
                    alert('Sorry buddy, you need all of those inputs to be filled or you need to be logged in!')
                }
            }
        }
    }
});
