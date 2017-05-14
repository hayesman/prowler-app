angular.module('articlesApp')
    .controller('ArticlesController', ['$scope', '$window', '$state', '$stateParams', '$ionicLoading', 'Articles', '$timeout', '$ionicHistory',
      function($scope, $window, $state, $stateParams, $ionicLoading, Articles, $timeout) {

        $scope.$on('$ionicView.enter', function(){
          // getArticles: function(title, author, body, topic, pub)
            $ionicLoading.show();

              // get publications
              Articles.getPublications().then(function(response){
                  $scope.publications = response.data.results;
                  console.log("PUBLICATIONS:")
                  console.log($scope.publications)
              }).catch(function(response){
                  //request was not successful
                  //handle the error
              }).finally(function(){
                  $ionicLoading.hide();
              });

              // get articles 
              Articles.getArticles(localStorage.getItem("query"), "", "", localStorage.getItem("topic"), 
                localStorage.getItem("pub")).then(function(response){
                  $scope.articles = response.data.results;
                  console.log(localStorage.getItem("query") + "," + "" + "," + "" + "," + localStorage.getItem("topic") + "," + localStorage.getItem("pub"))
                  console.log("ARTICLES:")
                  console.log($scope.articles)
              }).catch(function(response){
                  //request was not successful
                  //handle the error
              }).finally(function(){
                  $ionicLoading.hide();
              });

              // get topics
              Articles.getTopics().then(function(response){
                  $scope.topics = response.data.results;
                  console.log("TOPICS:")
                  console.log($scope.topics)
              }).catch(function(response){
                  //request was not successful
                  //handle the error
              }).finally(function(){
                  $ionicLoading.hide();
              });




          });

        $scope.searchArticles = function() {
          var query = $scope.myQuery;
          localStorage.setItem("query", query);
          $state.reload()
        }

        $scope.articlesHome = function() {
          var allPubs = 'allPubs'
          localStorage.setItem("allPubs", allPubs);
          var query = ''
          localStorage.setItem("query", query);
          var topic = ''
          localStorage.setItem("topic", topic);
          var pub = ''
          localStorage.setItem("pub", pub);
          $state.reload()
          console.log("E.T. phone home");
        }
        $scope.setArticlesTopic = function(topicId) {
          var topic = topicId
          localStorage.setItem("topic", topic);
          $state.reload()  
              console.log("Topic chosen, articles reloaded ;) ");
        }
        $scope.setPub = function(pubId) {
          console.log("pubID = " + pubId)
          if (pubId == "") {
            var allPubs = "allPubs"
            localStorage.setItem("allPubs", allPubs);
            var pub = ''
            localStorage.setItem("pub", pub);
          }
          else {
          var allPubs = ''
          localStorage.setItem("allPubs", allPubs);
          var pub = pubId
          localStorage.setItem("pub", pub);
          }
          var query = ''
          localStorage.setItem("query", query);
          var topic = ''
          localStorage.setItem("topic", topic);
          $state.reload()  
              console.log("Publication chosen, articles reloaded ;) ");
        }

        $scope.doRefresh = function() {
          $state.go($state.current, {}, {reload: true});
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.loadMore = function() {
          
          console.log("load more")
        }

        $scope.getThumbnail = function(article) {
          if (article.images[0] == null) {
            var pubId = article.publication
            var i = 0;
            while ($scope.publications[i].id != pubId) {
              i++
            }
            return $scope.publications[i].logo
          }
          else return article.images[0];
        }

        $scope.getPubName = function(pubId) {
            var i = 0;
            while ($scope.publications[i].id != pubId) {
              i++
            }
            return $scope.publications[i].name;
        }

        $scope.getTopicStyle = function(topicId) {
            if (topicId == "home" && localStorage.getItem("topic") == '') {
                return "font-family:garamond; font-weight:bold;";
            }
            else if (topicId == localStorage.getItem("topic")) {
                return "font-family:garamond; font-weight:bold;";
            }
            else {
            return  "font-family:garamond;"
            }
        }
        

        $scope.setPubIconColor = function(pubId) {
          

          if (localStorage.getItem("allPubs") == "allPubs") {
            if (pubId == 'allPubs') {
              return "background-color:grey;display:block;";
            }
          }
          else if (localStorage.getItem("pub") == pubId) {
            return "background-color:#D0D0D0;display:block;";
          }
          else {return "border: none;";}  
        }

    }])

    .controller('ArticleDetailController', function(Articles, $stateParams, $scope, $ionicLoading, $ionicHistory) {
        var _this = this;
        
        $scope.$on('$ionicView.enter', function(){
          //  $ionicLoading.show();

            Articles.getArticle($stateParams.articleId).then(function(response){
                _this.article = response.data;
                _this.articleBody = _this.article.body.toString();
               // _this.articleBody = _this.articleBody.split("\n").join("<br />");
                var pub = _this.article.publication;
                if (pub == 2) {
                  _this.publication = "The Daily Princetonian";
                }
                else {
                  _this.publication = "The Nassau Weekly";
                }
            }).catch(function(response){
                //request was not successful
                //handle the error
            }).finally(function(){
                $ionicLoading.hide();
            });

        })

        $scope.goBack = function(){
            $ionicHistory.goBack();
        }

        $scope.getArticleBody = function(body) {
          console.log("getArticleBody called")
          if (body == "/empty") {
            console.log("body is empty")
            return ""
          }
          else {
            return body;
          }
        }

    })


    angular.module('deepBlue.controllers', [])

    //top view controller
    .controller('AppCtrl', function($scope, $rootScope, $state) {
      
      // #SIMPLIFIED-IMPLEMENTATION:
      // Simplified handling and logout function.
      // A real app would delegate a service for organizing session data
      // and auth stuff in a better way.
      $rootScope.user = {};

      $scope.logout = function(){
        $rootScope.user = {};
        $state.go('app.start')
      };

    })

    // This controller is bound to the "app.account" view
    .controller('AccountCtrl', function($scope, $rootScope) {
      
      //readonly property is used to control editability of account form
      $scope.readonly = true;

      // #SIMPLIFIED-IMPLEMENTATION:
      // We act on a copy of the root user
      $scope.accountUser = angular.copy($rootScope.user);
      var userCopy = {};

      $scope.startEdit = function(){
        $scope.readonly = false;
        userCopy = angular.copy($scope.user);
      };

      $scope.cancelEdit = function(){
        $scope.readonly = true;
        $scope.user = userCopy;
      };
      
      // #SIMPLIFIED-IMPLEMENTATION:
      // this function should call a service to update and save 
      // the data of current user.
      // In this case we'll just set form to readonly and copy data back to $rootScope.
      $scope.saveEdit = function(){
        $scope.readonly = true;
        $rootScope.user = $scope.accountUser;
      };

    })

    .controller('LoginCtrl', function ($scope, $state, $rootScope) {

      // #SIMPLIFIED-IMPLEMENTATION:
      // This login function is just an example.
      // A real one should call a service that checks the auth against some
      // web service
      console.log("1")
      $scope.login = function(){
      console.log("2")
        //in this case we just set the user in $rootScope
        $rootScope.user = {
          email : "mary@ubiqtspaces.com",
          name : "Mary Ubiquitous",
          address : "Rue de Galvignac",
          city : "RonnieLand",
          zip  : "00007",
          avatar : 'sampledata/images/avatar.jpg'
        };
        //finally, we route our app to the 'app.shop' view
        $state.go('articles');
      };
      
    })




   