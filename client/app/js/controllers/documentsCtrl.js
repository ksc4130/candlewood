(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('documentsCtrl', documentsCtrl);
    documentsCtrl.$inject = ['$scope', 'authSrv', '$location', 'docs'];
    function documentsCtrl($scope, authSrv, $location, docs){
      if(!authSrv.user()){
          $location.path('/login');
      }
      $scope.user = authSrv.user();
      $scope.types = [
        {
          type: 'policies',
          name: 'Policies'
        },
        {
          type: 'non-permits',
          name: 'Non ERC Permits'
        },
        {
          type: 'minutes',
          name: 'Minutes'
        },
        {
          type: 'erc-permits',
          name: 'ERC Permits'
        },
        {
          type: 'security',
          name: 'Security'
        },
        {
          type: 'chronicle',
          name: 'Chronicle'
        },
        {
          type: 'other',
          name: 'Other'
        }
      ];
      $scope.selectedDocument = null;
      $scope.select = function(document){
          $scope.selectedDocument = angular.copy(document);
      };
      $scope.selected = function(document){
          return document && $scope.selectedDocument && document.name === $scope.selectedDocument.name;
      };
      $scope.filterDocs = {};
      $scope.documents = docs;
      console.log($scope.documents);
    }
}());
