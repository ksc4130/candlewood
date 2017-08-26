(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('documentsCtrl', documentsCtrl);
    documentsCtrl.$inject = ['$scope', 'authSrv', '$location'];
    function documentsCtrl($scope, authSrv, $location){
        if(!authSrv.user()){
            $location.path('/login');
        }
        $scope.authSrv = authSrv;
        $scope.selectedDocument = null;
        $scope.select = function(document){
            $scope.selectedDocument = angular.copy(document);
        };
        $scope.selected = function(document){
            return document && $scope.selectedDocument && document.name === $scope.selectedDocument.name;
        };
        $scope.filterDocs = {};
        if(authSrv.user()){ //TODO lock out unapproved users
            $scope.documents = [
                {
                    name: 'The Candlewood Chronicle',
                    type: 'chronicle',
                    src: '/app/docs/June_2017.pdf'
                },
                {
                    name: 'Incident Report',
                    type: 'security',
                    src: '/app/docs/Incident_Report.pdf'
                },
                {
                    name: 'Candlewood Lake Board Policies',
                    type: 'policies',
                    src: '/app/docs/Policy_Book.pdf'
                },
                {
                    name: 'Sign Permits',
                    type: 'non-permits',
                    src: '/app/docs/sign_permit.pdf'
                },{
                    name: 'June Board Meeting Minutes',
                    type: 'minutes',
                    src: '/app/docs/June_2017.pdf'
                },
                {
                    name: 'July Board Meeting Minutes',
                    type: 'minutes',
                    src: '/app/docs/June_2017.pdf'
                },
                {
                    name: 'Open House Permit',
                    type: 'non-permits',
                    src: '/app/docs/open_house_permit.pdf'
                },
                {
                    name: 'Tree Removal',
                    type: 'erc-permits',
                    src: '/app/docs/tree_permit.pdf'
                },
                {
                    name: 'Tree Cutting Release of Liability',
                    type: 'erc-permits',
                    src: '/app/docs/tree_liability.pdf'
                }
            ];
        }
    }
}());