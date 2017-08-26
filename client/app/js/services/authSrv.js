(function(){
    'use strict';
    angular.module('cwl.core')
        .factory('authSrv', authSrv);
    authSrv.$inject = ['$http', '$q'];
    function authSrv($http, $q){
        var _user;
        function login(user){
            var df = $q.defer();
            $http.post('/account/login', user).then(function(resp){
                if(resp.status === 200){
                    _user = resp.data.user;
                    df.resolve(resp.data);
                } else {
                    console.log(resp);
                    df.reject(resp);
                }
            }, function(resp){
                df.reject(resp);
                console.log(resp);
            });
            return df.promise;
        }
        function register(user){
            var df = $q.defer();
            $http.post('/account/user', {user: user}).then(function(resp){
                if(resp.status === 200){
                    df.resolve(resp.data);
                } else {
                    console.log(resp);
                    df.reject(resp);
                }
            }, function(resp){
                df.reject(resp);
                console.log(resp);
            });
            return df.promise;
        }
        return {
            login: login,
            register: register,
            user: function(){
                return _user ? {
                    firstName: _user.firstName,
                    lastName: _user.lastName,
                    email: _user.email
                } : null;
            }
        }
    }
}());