(function() {
  'use strict';
  // eslint-disable-next-line no-undef
  angular.module('cwl.core').controller('paymentCtrl', paymentCtrl);
  paymentCtrl.$inject = [
    '$scope',
    '$http',
    '$q',
    'authSrv',
    '$location',
    'hideTypeNav'
  ];
  function paymentCtrl($scope, $http, $q, authSrv, $location, hideTypeNav) {
    if (!authSrv.user()) {
      $location.path('/login');
    }

    $scope.hideTypeNav = hideTypeNav;

    $scope.loading = false;
    $scope.success = false;
    $scope.message = '';
    $scope.failed = false;
    $scope.error = '';
    $scope.ref = '';

    $scope.cardTransReq = {
      ssl_first_name: '',
      ssl_last_name: '',
      ssl_card_number: '',
      ssl_exp_date: '',
      ssl_amount: null,
      ssl_cvv2cvc2: null,
      lotNumber: ''
    };

    console.log('first:', $scope.cardTransReq.ssl_first_name);
    console.log('last:', $scope.cardTransReq.ssl_last_name);

    $scope.submit = function() {
      $scope.loading = true;
      $scope.success = false;
      $scope.message = '';
      $scope.failed = false;
      $scope.error = '';
      console.log('submit');
      var df = $q.defer();
      $http.post('/payment', $scope.cardTransReq).then(
        function(resp) {
          console.log('payment', resp);
          if (resp.status === 200) {
            if (resp.data.payment.status === 'APPROVED') {
              $scope.success = true;
              $scope.message =
                'Your payment has been processed. Your transaction ID is ' +
                resp.data.payment._id +
                ' and approval code is ' +
                resp.data.payment.refApprovalCode;
            } else {
              $scope.failed = true;
              $scope.error =
                (resp.data.payment.message ||
                  'We were unable complete your payment.') +
                ' Your transaction ID is ' +
                resp.data.payment._id +
                ' and approval code is ' +
                resp.data.payment.refApprovalCode;
            }
            df.resolve(resp.data);
          } else {
            $scope.failed = true;
            $scope.error =
              (resp.data.payment.message ||
                'We were unable complete your payment.') +
              ' Your transaction ID is ' +
              resp.data.payment._id +
              ' and approval code is ' +
              resp.data.payment.refApprovalCode;
            df.reject(resp);
          }
          $scope.loading = false;
        },
        function(resp) {
          $scope.loading = false;
          $scope.failed = true;
          $scope.error =
            (resp.data.payment.message ||
              'We were unable complete your payment.') +
            ' Your transaction ID is ' +
            resp.data.payment._id +
            ' and approval code is ' +
            resp.data.payment.refApprovalCode;
          console.log('payment error', resp);
          df.reject(resp);
        }
      );
      return df.promise;
    };
  }
})();
