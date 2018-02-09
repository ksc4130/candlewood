(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('homeCtrl', homeCtrl);
    homeCtrl.$inject = ['$scope', 'notifications'];
    function homeCtrl($scope, notifications){
        $scope.notifications = notifications;
        $scope.user = {
            isAuthenticated: function(){
                return true;
            }
        };
    }
}());
