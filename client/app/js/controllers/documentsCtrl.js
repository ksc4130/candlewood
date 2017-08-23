(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('documentsCtrl', documentsCtrl);
    documentsCtrl.$inject = ['$scope'];
    function documentsCtrl($scope){
        $scope.user = {
            isAuthenticated: function(){
                return true;
            }
        };
        $scope.filterDocs = {};
        if($scope.user.isAuthenticated()){
            //protect fetching documents unless authenticated
            $scope.documents = [
                {
                    name: 'June Minutes',
                    type: 'minutes'
                },
                {
                    name: 'July Minutes',
                    type: 'minutes'
                },
                {
                    name: 'Candlewood Lake Property Handbook 2017',
                    type: 'handbook'
                },
                {
                    name: 'Parade Permit',
                    type: 'misc'
                }
            ];
        }
    }
}());