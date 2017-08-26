(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', 'authSrv', 'documentSrv', 'FileUploader', '$location'];
    function adminCtrl($scope, authSrv, documentSrv, FileUploader, $location) {
        if(!authSrv.user()){
            $location.path('/login');
        }
        $scope.user = authSrv.user();
        $scope.newUser = {
            isAdmin: false,
            isActive: true
        };
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

        $scope.register = function(){
            if($scope.newUser.firstName && $scope.newUser.lastName && $scope.newUser.email && $scope.newUser.pwd && $scope.newUser.passwordConfirm){
                if($scope.newUser.pwd !== $scope.newUser.passwordConfirm){
                    $scope.error = 'Passwords do not match.';
                    return;
                }
                authSrv.register($scope.newUser).then(function(data){
                    if(data && !data.message){
                        $scope.users.push(data);
                        $scope.newUser = {
                            isActive: true,
                            isAdmin: false
                        };
                    }
                });
            } else {
                $scope.error = 'Please fill out all fields.';
            }
        };

    }
}());