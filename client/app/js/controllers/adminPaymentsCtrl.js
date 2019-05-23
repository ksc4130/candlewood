(function() {
  'use strict';
  // eslint-disable-next-line no-undef
  angular.module('cwl.core').controller('adminPaymentsCtrl', adminPaymentsCtrl);
  adminPaymentsCtrl.$inject = [
    '$scope',
    'authSrv',
    'FileUploader',
    '$location',
    'docs',
    'documentSrv',
    'notificationSrv',
    'notifications',
    '$http'
  ];
  function adminCtrl(
    $scope,
    authSrv,
    FileUploader,
    $location,
    docs,
    documentSrv,
    notificationSrv,
    notifications,
    $http
  ) {
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
