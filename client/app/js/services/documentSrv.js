(function(){
    'use strict';
    angular.module('cwl.core')
        .factory('documentSrv', documentSrv);
    documentSrv.$inject = ['$http', '$q'];
    function documentSrv($http, $q){

      function getDocuments(){
        var df = $q.defer();
        $http.get('/doc').then(function(resp){
          if(resp.status === 200){
            df.resolve(resp.data);
          } else {
            df.reject(resp);
          }
        }, function(resp){
          df.reject(resp);
        });
        return df.promise;
      }

      function deleteDocument(obj){
        var df = $q.defer();
        $http.delete('/doc/' + obj.id).then(function(resp){
          if(resp.status === 200){
            df.resolve(resp);
          } else {
            df.reject(resp);
          }
        }, function(resp){
          df.reject(resp);
        });
        return df.promise;
      }

      return {
        getDocuments: getDocuments,
        deleteDocument: deleteDocument
      }
    }
}());
