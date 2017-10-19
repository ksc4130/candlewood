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
  })
  // .state('memberDocuments', {
  //   url: '/members/documents',
  //   templateUrl: '/app/views/_documents.html',
  //   controller: 'documentsCtrl',
  //   resolve: {
  //     docs: ['documentSrv', function(documentSrv){
  //       return documentSrv.getDocuments();
  //     }]
  //   }
  // })
  .state('admin', {
    url: '/admin',
    templateUrl: '/app/views/_admin.html',
    controller: 'adminCtrl',
    resolve: {
      docs: ['documentSrv', function(documentSrv){
        return documentSrv.getDocuments(true);
      }]
    }
  }).state('documents', {
    url: '/documents',
    templateUrl: '/app/views/_documents.html',
    controller: 'documentsCtrl',
    resolve: {
      hideTypeNav: function () {return false;},
      docs: ['documentSrv', function(documentSrv){
        return documentSrv.getDocuments();
      }]
    }
  }).state('home', {
    url: '/',
    templateUrl: '/app/views/_home.html',
    controller: 'homeCtrl'
  }).state('contact', {
    url: '/contact',
    templateUrl: '/app/views/_contact.html'
  }).state('calendar', {
    url: '/news/calendar',
    templateUrl: '/app/views/_calendar.html',
    controller: ['$scope', 'calendar', function ($scope, calendar) {
      $scope.calendar = calendar;
    }],
    resolve: {
      calendar: ['documentSrv', function (documentSrv) {
        return documentSrv.getCalendar();
      }]
    }
  }).state('chronicle', {
    url: '/news/chronicle',
    templateUrl: '/app/views/_documents.html',
    controller: 'documentsCtrl',
    resolve: {
      hideTypeNav: function () {return true;},
      docs: ['documentSrv', '$q', function(documentSrv){
        return documentSrv.getDocumentsByType('chronicle');
      }]
    }
  }).state('eventsUpcoming', {
    url: '/events/upcoming',
    templateUrl: '/app/views/_eventsUpcoming.html',
    controller: ['$scope', 'docs', function ($scope, docs) {
      $scope.docs = docs;
    }],
    resolve: {
      docs: ['documentSrv', '$q', function(documentSrv){
        return documentSrv.getDocumentsByType('upcoming-events');
      }]
    }
  }).state('about', {
    url: '/about',
    templateUrl: '/app/views/_about.html'
  }).state('faqs', {
    url: '/faqs',
    templateUrl: '/app/views/_faqs.html'
  }).state('maps', {
    url: '/map',
    templateUrl: '/app/views/_maps.html'
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
  }).state('amenities', {
    url: '/explore/amenities',
    templateUrl: '/app/views/_exploreAmenities.html'
  }).state('nearby', {
    url: '/explore/nearby',
    templateUrl: '/app/views/_exploreNearby.html'
  }).state('clubs', {
    url: '/explore/clubs',
    templateUrl: '/app/views/_exploreClubs.html'
  }).state('fourth', {
    url: '/events/july-fourth',
    templateUrl: '/app/views/_eventsFourth.html'
  }).state('ongoing', {
    url: '/events/ongoing',
    templateUrl: '/app/views/_eventsOnGoing.html'
  }).state('reinfo', {
    url: '/real-estate/information',
    templateUrl: '/app/views/_realEstateInformation.html'
  }).state('reForSale', {
    url: '/real-estate/for-sale',
    templateUrl: '/app/views/_realEstateForSale.html',
    controller: ['$scope', function($scope){
      $scope.tab = 2;
    }]
  });
  $locationProvider.html5Mode(true);
}
