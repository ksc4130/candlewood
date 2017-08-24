(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$scope', 'authSrv', '$location', 'tab'];
    function loginCtrl($scope, authSrv, $location, tab){
        if(authSrv.user()){
            $location.path('/');
        }
        $scope.tab = tab ? tab : 1;
        $scope.showPass = true;
        $scope.showConfirm = true;
        $scope.showFirstName = true;
        $scope.showLastName = true;
        $scope.showEmail = true;
        $scope.user = {};
        $scope.forgot = {};
        $scope.login = function(){
            authSrv.login($scope.user).then(function(data){
                if(data && !data.message){
                    console.log(data);
                }
            });
        };
        $scope.register = function(){
            $scope.error = null;
            if($scope.user.pwd !== $scope.user.passwordConfirm){
                $scope.error = 'Passwords do not match.';
                return;
            }
            authSrv.register($scope.user).then(function(data){
                if(data && !data.message){
                    console.log(data);
                }
            });
        };
        $scope.forgotPassword = function(){
            authSrv.forgotPassword($scope.forgot);
        };
    }
}());