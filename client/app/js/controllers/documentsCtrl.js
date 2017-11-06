(function () {
  'use strict';
  angular.module('cwl.core')
    .controller('documentsCtrl', documentsCtrl);
  documentsCtrl.$inject = ['$scope', 'authSrv', '$location', 'docs', 'documentSrv', 'hideTypeNav'];
  function documentsCtrl($scope, authSrv, $location, docs, documentSrv, hideTypeNav) {
    $scope.hideTypeNav = hideTypeNav;
    $scope.types = documentSrv.types.filter(function(t) {
      return docs.length && docs.some(function(d) {return t.type === d.type;});
    });
    $scope.selectedDocument = docs[0];
    $scope.select = function (document) {
      $scope.selectedDocument = angular.copy(document);
    };


    $scope.selected = function (document) {
      return document && $scope.selectedDocument && document._id === $scope.selectedDocument._id;
    };

    $scope.filterDocs = {};
    $scope.documents = docs.filter(function (d) { return !d.expired; });
    console.log($scope.documents);
  }
}());
