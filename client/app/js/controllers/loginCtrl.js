(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$scope', 'authSrv', '$location', 'tab'];
    function loginCtrl($scope, authSrv, $location, tab){
        console.log(tab);
        $scope.tab = tab ? tab : 1;
        $scope.user = {};
        $scope.forgot = {};
        $scope.login = function(){
            authSrv.login($scope.user);
        };
        $scope.register = function(){
            authSrv.register($scope.user);
        };
        $scope.forgotPassword = function(){
            authSrv.forgotPassword($scope.forgot);
        };
    }
}());