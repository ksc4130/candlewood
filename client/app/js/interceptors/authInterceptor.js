(function() {
  'use strict';
  var quitCheckingUser = false;

  angular.module('cwl.core').factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$cookies'];
  function authInterceptor($cookies) {
    return {
      request: function(config) {
        const token = $cookies.get('t');

        if(token) {
          //fill x session token header with token
          config.headers['x-session-token'] = token;
        }

        return config;
      }
    };
  }
})();
