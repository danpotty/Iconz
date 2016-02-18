(function() {
	'use strict';
	angular.module('app')
	.factory('HomeFactory', HomeFactory);

	function HomeFactory($http, $q, $window) {
		var o = {};

		o.getAllIcons = function() {
			var q = $q.defer();
			$http.get('/api/v1/icons').then(function(res) {
				q.resolve(res.data);
			});
			return q.promise;
		}

		o.addIcon = function(icon) {
		  var q = $q.defer();
		  $http.post('/api/v1/icons', icon, {
				headers: { authorization: "Bearer " + $window.localStorage.getItem("token") }
			}).then(function(res) {
		    q.resolve(res.data);
		  });
		  return q.promise;
		};

		o.deleteIcon = function(id) {
			var q = $q.defer();
			$http.delete('/api/v1/icons/' + id).then(function(res) {
				q.resolve(res.data);
			});
			return q.promise;
		};

		o.updateIcon = function(newIcon, oldIcon) {
			var q = $q.defer();
			$http.put('/api/v1/icons/'+ oldIcon._id, newIcon).then(function(res) {
				q.resolve(res.data);
			});
			return q.promise;
		};

		o.like = function(id) {
			var q = $q.defer();
			$http.put('/api/v1/icons/like/' + id, null, { headers: {
				authorization: "Bearer " + $window.localStorage.getItem('token')
			}
		}).then(function(res) {
				q.resolve(res.data);
			});
			return q.promise;
		};

		return o;
	}
})();
