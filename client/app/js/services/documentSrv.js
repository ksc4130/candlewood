(function () {
  'use strict';
  angular.module('cwl.core')
    .factory('documentSrv', documentSrv);
  documentSrv.$inject = ['$http', '$q'];
  function documentSrv($http, $q) {

    function getDocuments(admin) {
      var df = $q.defer();
      $http.get((admin ? '/admin' : '') + '/doc').then(function (resp) {
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

    function getDocumentsByType(t) {
      var df = $q.defer();
      getDocuments().then(function (docs) {
        console.log('docs get documents by type in srv', docs);
        var byType = docs.filter(function (doc) {
          return doc.type === t;
        });
        df.resolve(byType);
      }, function (err) { df.reject(err); });

      return df.promise;
    }

    function getCalendar() {
      var df = $q.defer();
      $http.get('/calendar').then(function (resp) {
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

    function getDoc(id) {
      var df = $q.defer();
      $http.get('/doc/' + id).then(function (resp) {
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

    function updateDoc(obj) {
      var df = $q.defer();
      $http.put('/doc/', obj).then(function (resp) {
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

    function deleteDocument(obj) {
      var df = $q.defer();
      $http.delete('/doc/' + obj._id).then(function (resp) {
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
      getDocuments: getDocuments,
      getDocumentsByType: getDocumentsByType,
      getDoc: getDoc,
      updateDoc: updateDoc,
      deleteDocument: deleteDocument,
      getCalendar: getCalendar,
      types: [
        ...[
          {
            type: 'monthly-calendar',
            name: 'Monthly Calendar'
          },
          {
            type: 'chronicle',
            name: 'Chronicle'
          },
          {
            type: 'upcoming-events',
            name: 'Upcoming Events'
          },
          {
            type: 'unit-maps',
            name: 'Unit Maps'
          },
          {
            type: 'policies',
            name: 'Policies'
          },
          {
            type: 'non-permits',
            name: 'Non ECC Permits'
          },
          {
            type: 'minutes',
            name: 'Minutes'
          },
          {
            type: 'ecc-permits',
            name: 'ECC Permits'
          },
          {
            type: 'agenda',
            name: 'Agenda'
          },
          {
            type: 'financial',
            name: 'Financial'
          },
          {
            type: 'board-meeting',
            name: 'Board Meeting'
          },
        ].sort(x => x.type),
        {
          type: 'other',
          name: 'Other'
        }
      ]
    };
  }
}());
