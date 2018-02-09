(function () {
  'use strict';
  angular.module('cwl.core')
    .factory('notificationSrv', notificationSrv);
  notificationSrv.$inject = ['$http', '$q'];
  function notificationSrv($http, $q) {

    function getNotifications(admin) {
      var df = $q.defer();
      console.log('called get notifications');
      $http.get((admin ? '/admin' : '') + '/notification').then(function (resp) {
        console.log('get notifications resp', resp);
        if (resp.status === 200) {
          df.resolve(resp.data);
        } else {
          df.reject(resp);
        }
      }, function (resp) {
        df.reject(resp);
      });
      return df.promise;
    }

    function createNotification(notification) {
      var df = $q.defer();
      $http.post('/admin/notification', notification).then(function (resp) {
        if (resp.status === 200) {
          df.resolve(resp.data);
        } else {
          df.reject(resp);
        }
      }, function (resp) {
        df.reject(resp);
      });
      return df.promise;
    }

    function deleteNotification(obj) {
      var df = $q.defer();
      $http.delete('/notification/' + obj._id).then(function (resp) {
        if (resp.status === 200) {
          df.resolve(resp);
        } else {
          df.reject(resp);
        }
      }, function (resp) {
        df.reject(resp);
      });
      return df.promise;
    }

    return {
      createNotification: createNotification,
      getNotifications: getNotifications,
      deleteNotification: deleteNotification,
      types: [
        {
          type: 'primary',
          name: 'Blue'
        },
        {
          type: 'success',
          name: 'Green'
        },
        {
          type: 'danger',
          name: 'Red'
        },
        {
          type: 'warning',
          name: 'Yellow'
        },
        {
          type: 'info',
          name: 'Light Blue'
        },
      ]
    };
  }
}());
