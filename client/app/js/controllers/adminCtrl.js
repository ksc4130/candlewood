(function() {
  'use strict';
  // eslint-disable-next-line no-undef
  angular.module('cwl.core').controller('adminCtrl', adminCtrl);
  adminCtrl.$inject = [
    '$scope',
    'authSrv',
    'FileUploader',
    '$location',
    'docs',
    'documentSrv',
    'notificationSrv',
    'notifications'
  ];
  function adminCtrl(
    $scope,
    authSrv,
    FileUploader,
    $location,
    docs,
    documentSrv,
    notificationSrv,
    notifications
  ) {
    if (!authSrv.user()) {
      $location.path('/login');
    }
    $scope.user = authSrv.user();
    $scope.editUser = null;
    $scope.documents = docs;
    $scope.notifications = notifications || [];
    console.log('notifications', notifications);
    authSrv.getUsers().then(function(data) {
      if (data && data.length) {
        $scope.users = data;
      }
    });
    $scope.newUser = {
      isAdmin: false,
      isActive: true
    };

    function createUploader() {
      $scope.uploader = new FileUploader({
        removeAfterUpload: true,
        formData: [],
        url: '/upload',
        queueLimit: 1,
        // eslint-disable-next-line no-unused-vars
        onCompleteItem: function(item, response, status, headers) {
          if (status === 200) {
            $scope.documents.push(response);
            $scope.newDoc = {
              when: new Date()
            };
          } else {
            $scope.uploadError = response;
          }
        }
      });

      $scope.uploader.onBeforeUploadItem = function(file) {
        file.formData.push($scope.newDoc);
      };

      // eslint-disable-next-line no-unused-vars
      $scope.uploader.onCompleteAll = function(file) {
        // eslint-disable-next-line no-undef
        document.getElementById('uploader').value = null;
      };
    }
    createUploader();

    $scope.newDoc = {
      when: new Date(),
      until: null
    };

    $scope.filteredDocuments = function() {
      if ($scope.documents) {
        return $scope.typeFilter
          ? $scope.documents.filter(function(sItem) {
            return sItem.type === $scope.typeFilter;
          })
          : $scope.documents;
      }
      return null;
    };

    $scope.types = documentSrv.types;

    $scope.selectUser = function(x) {
      // eslint-disable-next-line no-undef
      $scope.editUser = angular.copy(x);
    };

    $scope.selectDoc = function(x) {
      // eslint-disable-next-line no-undef
      $scope.editDoc = angular.copy(x);
      $scope.editDoc.when = new Date($scope.editDoc.when);
      $scope.editDoc.until = new Date($scope.editDoc.until);
    };

    $scope.updateDoc = function() {
      console.log($scope.editDoc);
      if ($scope.editDoc.name && $scope.editDoc.when && $scope.editDoc.type) {
        $scope.editDoc.saving = true;
        documentSrv.updateDoc($scope.editDoc).then(
          function(data) {
            if (data && !data.message) {
              var found = $scope.documents.filter(function(sItem) {
                return sItem._id === $scope.editDoc._id;
              })[0];
              if (found) {
                $scope.documents[$scope.documents.indexOf(found)] = data;
              }
              $scope.editDoc = null;
            } else {
              $scope.editDoc.error = data;
              console.log('error', data);
            }
          },
          function(resp) {
            $scope.editDoc.error = resp;
            console.log('error', resp);
          }
        );
      } else {
        $scope.editDoc.error = 'Please fill out all required fields.';
      }
    };

    $scope.removeDoc = function(doc) {
      var found = $scope.documents.filter(function(sItem) {
        return sItem._id === doc._id;
      })[0];
      if (found) {
        documentSrv.deleteDocument(doc).then(function(resp) {
          if (resp.status === 200) {
            $scope.documents.splice($scope.documents.indexOf(found), 1);
          }
        });
      }
    };

    $scope.submit = function() {
      $scope.uploader.uploadAll();
    };

    $scope.updateUser = function() {
      $scope.editUser.saving = true;
      authSrv.updateUser($scope.editUser).then(
        function(data) {
          if (data && !data.message) {
            var found = $scope.users.filter(function(sItem) {
              return sItem._id === $scope.editUser._id;
            })[0];
            if (found) {
              $scope.users[$scope.users.indexOf(found)] = data;
            }
            $scope.editUser = null;
          } else {
            $scope.editUser.error = true;
            console.log('Error', data);
            $scope.editUser.saving = false;
          }
        },
        function(data) {
          console.log('error', data);
          $scope.editUser.error = true;
          $scope.editUser.saving = false;
        }
      );
    };

    $scope.deleteUser = function(user) {
      user.deleting = true;
      authSrv.deleteUser(user).then(
        function(resp) {
          if (resp.status === 200) {
            var found = $scope.users.filter(function(sItem) {
              return sItem._id === user._id;
            })[0];
            if (found) {
              $scope.users.splice($scope.users.indexOf(found), 1);
            }
          } else {
            console.log('error', resp);
            user.deleting = false;
          }
        },
        function(resp) {
          console.log('error', resp);
          user.deleting = false;
        }
      );
    };

    $scope.register = function() {
      if (
        $scope.newUser.firstName &&
        $scope.newUser.lastName &&
        $scope.newUser.email &&
        $scope.newUser.pwd &&
        $scope.newUser.passwordConfirm
      ) {
        if ($scope.newUser.pwd !== $scope.newUser.passwordConfirm) {
          $scope.error = 'Passwords do not match.';
          return;
        }
        authSrv.register($scope.newUser).then(function(data) {
          if (data && !data.message) {
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

    $scope.setIndex = function(notification, direction) {
      var index = notification.index;

      $scope.notifications.forEach(function(n) {
        if (notification._id === n._id) {
          return;
        }

        console.log('loop', n.title, n.index);
        if (direction === 'up') {
          if (
            n.index === index - 1 &&
            n.index < $scope.notifications.length - 1
          ) {
            n.index += 1;
          }
        } else {
          if (n.index === index + 1 && n.index > 0) {
            n.index -= 1;
          }
        }
        console.log('loop-b', n.title, n.index);
      });
      notification.index =
        direction === 'up'
          ? index <= 0
            ? 0
            : index - 1
          : index >= $scope.notifications.length - 1
            ? $scope.notifications.length - 1
            : index + 1;
      console.log(
        'working',
        notification.title,
        direction,
        index,
        notification.index
      );
      console.log('updating', $scope.notifications);
      notificationSrv
        .updateAllNotifications($scope.notifications)
        .then(function(updated) {
          console.log('notifications update resp', updated);
          $scope.notifications = updated;
        })
        .catch(function(err) {
          console.log('notifications update error', err);
        });
    };

    //notification
    $scope.newNotification = {
      when: new Date(),
      until: null,
      type: notificationSrv.types[0].type,
      index: $scope.notifications.length
    };
    $scope.notificationTypes = notificationSrv.types;
    console.log('notification types', $scope.notificationTypes);

    $scope.submitNotification = function(toSave) {
      notificationSrv.createNotification(toSave).then(function(created) {
        $scope.notifications.push(created);
      });
    };

    $scope.removeNotification = function(notification) {
      var found = $scope.notifications.filter(function(sItem) {
        return sItem._id === notification._id;
      })[0];
      if (found) {
        notificationSrv.deleteNotification(notification).then(function(resp) {
          if (resp.status === 200) {
            $scope.notifications.splice($scope.notifications.indexOf(found), 1);
          }
        });
      }
    };
  }
})();
