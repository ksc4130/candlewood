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

      function getDoc(id){
        var df = $q.defer();
        $http.get('/doc/' + id).then(function(resp){
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
        $http.delete('/doc/' + obj._id).then(function(resp){
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
        getDoc: getDoc,
        deleteDocument: deleteDocument,
        types: [
            {
                type: 'policies',
                name: 'Policies'
            },
            {
                type: 'non-permits',
                name: 'Non ECC Permits'
            },
            {
                type: 'minutes',
                name: 'Minutes'
            },
            {
                type: 'ecc-permits',
                name: 'ECC Permits'
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
        ]
      };
    }
}());
