(function() {
  'use strict';
  // eslint-disable-next-line no-undef
  angular.module('cwl.core').controller('adminPaymentsCtrl', adminPaymentsCtrl);
  adminPaymentsCtrl.$inject = ['$scope', 'authSrv', '$location', '$http'];
  function adminPaymentsCtrl($scope, authSrv, $location, $http) {
    if (!authSrv.user()) {
      $location.path('/login');
    }

    $scope.payments = [];

    $http.get('/admin/payment').then(function(resp) {
      console.log('payments', resp);
      $scope.payments = resp.data;
    });
  }
})();
