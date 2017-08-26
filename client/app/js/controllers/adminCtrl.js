(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', 'authSrv', 'documentSrv', 'FileUploader', '$location'];
    function adminCtrl($scope, authSrv, documentSrv, FileUploader, $location) {
        if(!authSrv.user()){
            $location.path('/login');
        }
        $scope.authSrv = authSrv;
        $scope.uploader = new FileUploader({
            formData: [],
            url: '/fakeurl'
        });
        $scope.newDoc = {
            time: new Date()
        };
        $scope.users = [
            {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jdoe@example.com',
                isActive: true,
                isAdmin: true
            },
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'jdoe@yahoo.com',
                isActive: false,
                isAdmin: false
            }
        ];
        $scope.types = [
            {
                type: 'policies',
                name: 'Policies'
            },
            {
                type: 'non-permits',
                name: 'Non ERC Permits'
            },
            {
                type: 'minutes',
                name: 'Minutes'
            },
            {
                type: 'erc-permits',
                name: 'ERC Permits'
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
        ];
        $scope.submit = function(){
            $scope.uploader.formData.push($scope.newDoc);
            console.log($scope.uploader, $scope.newDoc);
        };

    }
}());