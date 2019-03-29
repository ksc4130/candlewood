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
    $scope.cardTransReq = {
      ssl_card_number: '4124939999999990',
      ssl_exp_date: '1220',
      ssl_amount: 1.0,
      ssl_cvv2cvc2: 123,
      lotNumber: 'a-15'
    };

    $scope.submit = function() {
      console.log('submit');
      var df = $q.defer();
      $http.post('/payment', $scope.cardTransReq).then(
        function(resp) {
          console.log('payment', resp);
          if (resp.status === 200) {
            df.resolve(resp.data);
          } else {
            df.reject(resp);
          }
        },
        function(resp) {
          console.log('payment error', resp);
          df.reject(resp);
        }
      );
      return df.promise;
    };
  }
})();
