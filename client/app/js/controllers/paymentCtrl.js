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
    $scope.hideTypeNav = hideTypeNav;

    $scope.loading = false;
    $scope.success = false;
    $scope.message = '';
    $scope.failed = false;
    $scope.error = '';
    $scope.ref = '';

    $scope.cardTransReq = {
      ssl_first_name: 'Kyle',
      ssl_last_name: 'Curren',
      ssl_card_number: '4124939999999990',
      ssl_exp_date: '1220',
      ssl_amount: 1.0,
      ssl_cvv2cvc2: 123,
      lotNumber: 'a-15'
    };

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
              $scope.message = `Your payment has been processed. Your transaction ID is ${
                resp.data.payment._id
              }`;
            } else {
              $scope.failed = true;
              $scope.error = `We were unable complete your payment. Your transaction ID is ${
                resp.data.payment._id
              }`;
            }
            df.resolve(resp.data);
          } else {
            $scope.failed = true;
            $scope.error = `We were unable complete your payment. Your transaction ID is ${
              resp.data.payment._id
            }`;
            df.reject(resp);
          }
          $scope.loading = false;
        },
        function(resp) {
          $scope.loading = false;
          $scope.failed = true;
          $scope.error = `We were unable complete your payment. Your transaction ID is ${
            resp.data.payment._id
          }`;
          console.log('payment error', resp);
          df.reject(resp);
        }
      );
      return df.promise;
    };
  }
})();
