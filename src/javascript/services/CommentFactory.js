(function() {
  'use strict';
  angular.module('app')
  .factory('CommentFactory', CommentFactory);

  function CommentFactory($http, $q, $window) {
    var o = {};

    o.getIconById = function(id){
      var q = $q.defer();
      $http.get('/api/v1/comments/' + id).then(function(res) {
        q.resolve(res.data);
      });
      return q.promise;
    };

    o.addComment = function(id, comment) {
      var q = $q.defer();
      $http.post('/api/v1/comments/' + id, comment, { headers : { authorization : "Bearer " +
      $window.localStorage.getItem('token')}}).then(function(res) {
        q.resolve(res.data);
      });
      return q.promise;
    };

    o.deleteComment = function(id) {
      var q = $q.defer();
      $http.delete('/api/v1/comments/' + id).then(function(res) {
        q.resolve(res.data);
      });
      return q.promise;
    };

    o.editCom = function(newCom, oldCom) {
      var q = $q.defer();
      $http.put('/api/v1/comments/' + oldCom._id, newCom).then(function(res) {
        q.resolve(res.data);
      });
      return q.promise;
    };

    return o;
  }
})();
