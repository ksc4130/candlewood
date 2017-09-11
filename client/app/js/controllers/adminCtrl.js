(function(){
    'use strict';
    angular.module('cwl.core')
        .controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', 'authSrv', 'FileUploader', '$location', 'docs', 'documentSrv'];
    function adminCtrl($scope, authSrv, FileUploader, $location, docs, documentSrv) {
        if(!authSrv.user()){
            $location.path('/login');
        }
        $scope.user = authSrv.user();
        $scope.editUser = null;
        $scope.documents = docs;
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

        $scope.filteredDocuments = function(){
          if($scope.documents){
            return $scope.typeFilter ? $scope.documents.filter(function(sItem){
              return sItem.type === $scope.typeFilter;
            }) : $scope.documents;
          }
          return null;
        };

        $scope.types = documentSrv.types;

        $scope.selectUser = function(x){
          $scope.editUser = angular.copy(x);
        };

        $scope.selectDoc = function(x){
          $scope.editDoc = angular.copy(x);
        };

        $scope.updateDoc = function(){
          if($scope.editDoc.name && $scope.editDoc.when && $scope.editDoc.type){
            $scope.editDoc.saving = true;
            documentSrv.updateDoc($scope.editDoc).then(function(data){
              if(data && !data.message){
                var found = $scope.documents.filter(function(sItem){
                  return sItem._id === $scope.editDoc._id;
                })[0];
                if(found){
                  $scope.documents[$scope.documents.indexOf(found)] = data;
                }
                $scope.editDoc = null;
              } else {
                $scope.editDoc.error = data;
                console.log('error', data);
              }
            }, function(resp){
              $scope.editDoc.error = resp;
              console.log('error', resp);
            });
          } else {
            $scope.editDoc.error = 'Please fill out all required fields.';
          }
        };

        $scope.removeDoc = function(doc){
          var found = $scope.documents.filter(function(sItem){
            return sItem._id === doc._id;
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
                return sItem._id === $scope.editUser._id;
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
                return sItem._id === user._id;
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
