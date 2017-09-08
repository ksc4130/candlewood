(function () {
  'use strict';
  var _user = null;
  angular.module('cwl.core')
    .factory('authSrv', authSrv);
  authSrv.$inject = ['$http', '$q', '$rootScope', '$cookies'];
  function authSrv($http, $q, $rootScope, $cookies) {
    function fillCurrentUser() {
      const df = $q.defer();
      $http.get('/account/user').then(function(resp) {
        if(resp.status === 200 && resp.data) {
          //fill private _user and resolve df
          _user = resp.data;
          return df.resolve(resp);
        }
        logout();
        df.resolve();
      });
      return df.promise;
    }

    function getUsers() {
      const df = $q.defer();
      $http.get('/user').then(function(resp) {
        if(resp.status === 200) {
          df.resolve(resp.data);
        } else {
          df.reject(resp);
        }
      }, function(resp){
        df.reject(resp);
      });
      return df.promise;
    }

    function updateUser(obj) {
      const df = $q.defer();
      $http.put('/user', obj).then(function(resp) {
        if(resp.status === 200) {
          df.resolve(resp.data);
        } else {
          df.reject(resp);
        }
      }, function(resp){
        df.reject(resp);
      });
      return df.promise;
    }

    function deleteUser(obj) {
      const df = $q.defer();
      $http.delete('/user/' + obj._id).then(function(resp) {
        if(resp.status === 200) {
          df.resolve(resp);
        } else {
          df.reject(resp);
        }
      }, function(resp){
        df.reject(resp);
      });
      return df.promise;
    }

    function logout() {
      console.log('logout');
      $cookies.remove('t');
      _user = null;
    }

    function login(user) {
      var df = $q.defer();
      $http.post('/account/login', user).then(function (resp) {
        if (resp.status === 200) {
          _user = resp.data.user;
          //set token TODO: set expires to a day
          $cookies.put('t', _user.token);
          $rootScope.$broadcast('auth');
          df.resolve(resp.data);
        } else {
          console.log(resp);
          df.reject(resp);
        }
      }, function (resp) {
        df.reject(resp);
        console.log(resp);
      });
      return df.promise;
    }

    function register(user) {
      var df = $q.defer();
      $http.post('/account/user', { user: user }).then(function (resp) {
        if (resp.status === 200) {
          df.resolve(resp.data.user);
        } else {
          console.log(resp);
          df.reject(resp);
        }
      }, function (resp) {
        df.reject(resp);
        console.log(resp);
      });
      return df.promise;
    }
    return {
      login: login,
      register: register,
      fillCurrentUser: fillCurrentUser,
      logout: logout,
      getUsers: getUsers,
      updateUser: updateUser,
      deleteUser: deleteUser,
      user: function () {
        return _user ? {
          firstName: _user.firstName,
          lastName: _user.lastName,
          email: _user.email,
          isAdmin: _user.isAdmin,
          isActive: _user.isActive
        } : null;
      }
    }
  }

  $(function () {
    //life before the world
    var token = document.cookie.replace(/(?:(?:^|.*;\s*)t\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    $.ajax({
      url: "/account/user",
      headers: {'x-session-token': token},
      success: function (data) {
        _user = data;
        angular.bootstrap($('html')[0], ['cwl.core']);
      }, error: function (resp) {
        angular.bootstrap($('html')[0], ['cwl.core']);
      }
    });
  });
}());
