(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('documentsCtrl', documentsCtrl);
    documentsCtrl.$inject = ['$scope', 'authSrv', '$location', 'docs', 'documentSrv'];
    function documentsCtrl($scope, authSrv, $location, docs, documentSrv){
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
        documentSrv.getDoc(document._id).then(function(data){
          if(data){
            console.log(data);
            $scope.selectedDocument = angular.copy(document);
            $scope.selectedDocument.url = data;
          }
        });
      };

      $scope.selected = function(document){
          return document && $scope.selectedDocument && document._id === $scope.selectedDocument._id;
      };

      $scope.filterDocs = {};
      $scope.documents = docs;
      console.log($scope.documents);
    }
}());
