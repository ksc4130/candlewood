(function() {
  'use strict';

  angular.module('cwl.core').factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$cookies', '$injector'];
  function authInterceptor($cookies, $injector) {
    return {
      request: function(config) {
        const token = $cookies.get('t');

        if(token) {
          //fill x session token header with token
          config.headers['x-session-token'] = token;
        }

        return config;
      },
      responseError: function (config) {
        console.log(config);
        if(config.status === 401) {
          return $injector.get('$state').transitionTo('login');
        }
        return config;
      }
    };
  }
})();
