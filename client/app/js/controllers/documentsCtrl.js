(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('documentsCtrl', documentsCtrl);
    documentsCtrl.$inject = ['$scope', 'authSrv', '$location', 'docs', 'documentSrv'];
    function documentsCtrl($scope, authSrv, $location, docs, documentSrv){
      // if(!authSrv.user()){
      //     $location.path('/login');
      // }
      // $scope.user = authSrv.user();
      $scope.types = documentSrv.types;
      $scope.selectedDocument = null;
      $scope.select = function(document){
          $scope.selectedDocument = angular.copy(document);
      };

      $scope.selected = function(document){
          return document && $scope.selectedDocument && document._id === $scope.selectedDocument._id;
      };

      $scope.filterDocs = {};
      $scope.documents = docs.filter(function(d) { return !d.expired; });
      console.log($scope.documents);
    }
}());
