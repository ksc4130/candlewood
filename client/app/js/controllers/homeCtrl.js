(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('homeCtrl', homeCtrl);
    homeCtrl.$inject = ['$scope'];
    function homeCtrl($scope){
        $scope.user = {
            isAuthenticated: function(){
                return true;
            }
        };
    }
}());