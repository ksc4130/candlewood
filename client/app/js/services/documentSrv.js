(function(){
    'use strict';
    angular.module('cwl.core')
        .factory('documentSrv', documentSrv);
    documentSrv.$inject = ['$http', '$q'];
    function documentSrv($http, $q){
        return {}
    }
}());