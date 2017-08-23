(function(){
    'use strict';
    angular.module('cwl.core')
        .factory('authSrv', authSrv);
    authSrv.$inject = ['$http', '$q'];
    function authSrv($http, $q){
        return {
            login: function(user){
                console.log(user);
            }
        }
    }
}());