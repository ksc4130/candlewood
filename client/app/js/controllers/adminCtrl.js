(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', 'authSrv', 'documentSrv', 'FileUploader', '$location', '$timeout'];
    function adminCtrl($scope, authSrv, documentSrv, FileUploader, $location, $timeout) {
        if(!authSrv.user()){
            $location.path('/login');
        }
        $scope.user = authSrv.user();
        authSrv.getUsers().then(function(data){
          if(data && data.length){
            $scope.users = data;
          }
        });
        $scope.newUser = {
            isAdmin: false,
            isActive: true
        };
        $scope.uploader = new FileUploader({
            formData: [],
            url: '/fakeurl',
            queueLimit: 1
        });
        $scope.newDoc = {
            time: new Date()
        };

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
            $scope.uploader.uploadAll();
        };

        $scope.updateUser = function(user){
          user.saving = true;
          authSrv.updateUser(user).then(function(data){
            if(data && !data.message){
              user.successfulSave = true;
              $timeout(function(){
                  user.successfulSave = false;
              }, 1000);
              user.saving = false;
            } else {
              user.error = true;
              user.saving = false;
              console.log('Error', data);
            }
          },function(data){
            console.log('error', data);
            user.error = true;
            user.saving = false;
          });
        };

        $scope.deleteUser = function(user){
          user.deleting = true;
          authSrv.deleteUser(user).then(function(resp){
            if(resp.status === 200){
              var found = $scope.users.filter(function(sItem){
                return sItem.id === user.id;
              })[0];
              if(found){
                $scope.users.splice($scope.users.indexOf(found), 1);
              }
            } else {
              console.log('error', resp);
              user.error = true;
              user.deleting = false;
            }
          }, function(resp){
            console.log('error', resp);
            user.error = true;
            user.deleting = false;
          });
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
