var app = angular.module('cwl.core', ['ui.router', 'ui.bootstrap', 'ngAside', 'angularFileUpload', 'ngCookies']);

app.run(["$rootScope", function ($rootScope) {
  $rootScope.today = new Date();
}]);


app.config(config);
config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];
function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  //add auth interceptor to all requests
  $httpProvider.interceptors.push('authInterceptor');

  $urlRouterProvider.otherwise('/');
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/app/views/_login.html',
    controller: 'loginCtrl',
    resolve: {
      tab: [function () {
        return 1;
      }]
    }
  }).state('documents', {
    url: '/members/documents',
    templateUrl: '/app/views/_documents.html',
    controller: 'documentsCtrl',
    resolve: {
      docs: ['documentSrv', function(documentSrv){
        return documentSrv.getDocuments();
      }]
    }
  }).state('admin', {
    url: '/admin',
    templateUrl: '/app/views/_admin.html',
    controller: 'adminCtrl',
    resolve: {
      docs: ['documentSrv', function(documentSrv){
        return documentSrv.getDocuments();
      }]
    }
  }).state('home', {
    url: '/',
    templateUrl: '/app/views/_home.html',
    controller: 'homeCtrl'
  }).state('lake', {
    url: '/explore/lake',
    templateUrl: '/app/views/_exploreLake.html'
  }).state('pool', {
    url: '/explore/pools',
    templateUrl: '/app/views/_explorePools.html'
  }).state('beach', {
    url: '/explore/beach',
    templateUrl: '/app/views/_exploreBeach.html'
  }).state('activities', {
    url: '/explore/activities',
    templateUrl: '/app/views/_exploreActivities.html'
  }).state('community', {
    url: '/explore/community',
    templateUrl: '/app/views/_exploreCommunity.html'
  });
  $locationProvider.html5Mode(true);
}
