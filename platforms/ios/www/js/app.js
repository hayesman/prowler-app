// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('articlesApp', ['ionic', 'deepBlue.controllers', 'deepBlue.services'])

.run(function($ionicPlatform, $rootScope, $timeout, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        if(toState.data && toState.data.auth == true && !$rootScope.user.email){
          event.preventDefault();
          $state.go('login');   
        }
  });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
          url: '/login',
          cached : false,
          views: {
            'menuContent': {
              templateUrl: 'templates/login.html',
              controller : 'LoginCtrl'
            }
          }
        })
  
        .state('articles', {
            url: '/articles',
            params :{query:null, articles:null},
            templateUrl: 'templates/articles.html',
            controller: 'ArticlesController',
            controllerAs: 'articles'
        })
        .state('article-detail', {
            url: '/articles/:articleId',
            templateUrl: 'templates/article-detail.html',
            controller: 'ArticleDetailController',
            controllerAs: 'articleDetail'
        });
        
    $urlRouterProvider.otherwise('/articles');
});