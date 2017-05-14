angular.module('articlesApp')
    .controller('ArticlesController', ['$scope', '$window', '$state', '$stateParams', '$ionicLoading', 'Articles', '$timeout', '$ionicHistory',
      function($scope, $window, $state, $stateParams, $ionicLoading, Articles, $timeout) {

          $scope.noMoreItemsAvailable = false;
          $scope.num = 1;
          $scope.url = "https://prowler333.herokuapp.com/articles.json";
          $scope.currarticles= [];
          $scope.articles=[];
          $scope.topic = '';
          $scope.pub = '';
          $scope.body = '';
          $scope.author = '';

          $scope.loadMore = function() {
            console.log($scope.url);
            Articles.getArticlesfromurl($scope.url).then(function(response){
                $scope.currarticles = response.data.results;
                if (response.data.next == null) {
                  console.log("no more");
                  console.log($scope.num);
                  $scope.noMoreItemsAvailable = true;

                }
                else {
                  $scope.url = response.data.next;
                  $scope.num ++;
                  var first = [];
                  if ($scope.num > 2){
                  first = first.concat($scope.articles);
                  first =first.concat($scope.currarticles);
                  $scope.articles = first;
                  }
                  else {
                    $scope.articles = $scope.currarticles;
                  }
                  console.log($scope.articles);
                }
                
            }).finally(function(){
                $ionicLoading.hide();
           
                  $scope.$broadcast('scroll.infiniteScrollComplete');
              
          });
                

        };
          // getArticles: function(title, author, body, topic, pub)
              // get publications
              Articles.getPublications().then(function(response){
                  $scope.publications = response.data.results;
              }).catch(function(response){
                  //request was not successful
                  //handle the error
              }).finally(function(){
                  $ionicLoading.hide();
              });

              // get topics
              Articles.getTopics().then(function(response){
                  $scope.topics = response.data.results;
              }).catch(function(response){
                  //request was not successful
                  //handle the error
              }).finally(function(){
                  $ionicLoading.hide();
              });

        
        $scope.searchArticles = function(myQuery) {
          $scope.query = myQuery;
          console.log($scope.query);
          $scope.num = 1;
          $scope.articles=[];
          $scope.noMoreItemsAvailable = false;
          $scope.url = 'https://prowler333.herokuapp.com/articles.json?title=' + $scope.query + '&author=' 
                            + $scope.query+ '&body=' + $scope.query + '&topic=' + $scope.topic + '&publication=' + $scope.pub;
         $scope.$broadcast('scroll.infiniteScrollComplete');
        }


        $scope.articlesHome = function() {
          $scope.query = '';
          $scope.topic = '';
          $scope.pub = '';
          $scope.articles = [];
          $scope.noMoreItemsAvailable = false;
          $scope.num = 1;
          $scope.url = "https://prowler333.herokuapp.com/articles.json";
          console.log("E.T. phone home");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        $scope.setArticlesTopic = function(topicId) {
          var topic = topicId
          $scope.topic = topicId;
          $scope.query = '';
          $scope.articles = [];
          $scope.noMoreItemsAvailable = false;
          $scope.num = 1
          $scope.url = 'https://prowler333.herokuapp.com/articles.json?title=' + $scope.query + '&author=' 
                            + $scope.query+ '&body=' + $scope.query + '&topic=' + $scope.topic + '&publication=' + $scope.pub;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        $scope.setPub = function(pubId) {
          console.log("pubID = " + pubId)
          // set publication to all
          if (pubId == "") {
            $scope.articles=[]
            $scope.num = 1
            $scope.query='';
            $scope.noMoreItemsAvailable = false;
            $scope.pub = '';
          }
          // update the publication
          else {
          $scope.pub = pubId;
          }
          var query = ''
          localStorage.setItem("query", query);
          var topic = ''
          localStorage.setItem("topic", topic);
          $scope.topic = '';
          $scope.query = '';
          $scope.noMoreItemsAvailable = false;
         $scope.articles=[];
         $scope.num = 1;
          $scope.url = 'https://prowler333.herokuapp.com/articles.json?title=' + $scope.query + '&author=' 
                            + $scope.query+ '&body=' + $scope.query + '&topic=' + $scope.topic + '&publication=' + $scope.pub;
         console.log("Publication chosen, articles reloaded ;) ");
         $scope.$broadcast('scroll.infiniteScrollComplete');

        }

        $scope.getThumbnail = function(article) {
          if (article.images[0] == null) {
            var pubId = article.publication;
            var i = 0;
            while ($scope.publications[i].id != pubId) {
              i++;
            }
            return $scope.publications[i].logo;
          }
          else return article.images[0];
        }

        $scope.getPubName = function(pubId) {
            var i = 0;
            while ($scope.publications[i].id != pubId) {
              i++;
            }
            return $scope.publications[i].name;
        }

        $scope.getTopicStyle = function(topicId) {
            if (topicId == "home" && $scope.topic == '') {
                return "background-color:grey";
            }
            else if (topicId == $scope.topic) {
                return " background-color:grey";
            }
            else {
            return  "background-color:black;"
            }
        }

        $scope.checkScroll = function() {
             var currentTop = $ionicScrollDelegate.getScrollPosition().top;
             var maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
             console.log("bleh")
             if (currentTop >= maxTop) {
                 // hit the bottom
                 // Call API to Load Data
                     $scope.loadNextRecords();
             }
         };
        

        $scope.setPubIconColor = function(pubId) {
          if ($scope.pub == '') {
            if (pubId == 'allPubs') {
              return "color:grey;";
            }
          }
          else if ($scope.pub == pubId) {
            return "color:grey;";
          }
          else {return "";}  
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
                var topic = _this.article.topic;
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
            console.log("body is empty");
            return "";
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




   