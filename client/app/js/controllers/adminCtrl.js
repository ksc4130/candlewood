(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', 'authSrv', 'FileUploader', '$location', 'docs'];
    function adminCtrl($scope, authSrv, FileUploader, $location, docs) {
        if(!authSrv.user()){
            $location.path('/login');
        }
        $scope.user = authSrv.user();
        $scope.editUser = null;
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
            url: '/upload',
            queueLimit: 1
        });
        $scope.uploader.onBeforeUploadItem = function (file) {
          file.formData.push($scope.newDoc);
        };
        $scope.newDoc = {
            when: new Date()
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

        $scope.prettyDoc = function(x){
          return x && $scope.types.filter(function(sItem){
            return sItem.type === x;
          })[0] ? ($scope.types.filter(function(sItem){
            return sItem.type === x;
          })[0]).name : null;
        };

        $scope.removeDoc = function(doc){
          var found = $scope.documents.filter(function(sItem){
            return sItem.id === doc.id;
          })[0];
          if(found){
            documentSrv.deleteDocument(doc).then(function(resp){
              if(resp.status === 200){
                $scope.documents.splice($scope.documents.indexOf(found), 1);
              }
            });
          }
        };

        $scope.submit = function(){
            $scope.uploader.formData.push($scope.newDoc);
            $scope.uploader.uploadAll();
        };

        $scope.updateUser = function(){
          $scope.editUser.saving = true;
          authSrv.updateUser($scope.editUser).then(function(data){
            if(data && !data.message){
              var found = $scope.users.filter(function(sItem){
                return sItem.id === user.id;
              })[0];
              if(found){
                $scope.users[$scope.users.indexOf(found)] = data;
              }
              $scope.editUser = null;
            } else {
              $scope.editUser.error = true;
              console.log('Error', data);
              $scope.editUser.saving = false;
            }
          },function(data){
            console.log('error', data);
            $scope.editUser.error = true;
            $scope.editUser.saving = false;
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
              user.deleting = false;
            }
          }, function(resp){
            console.log('error', resp);
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
