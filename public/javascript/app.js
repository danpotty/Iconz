(function() {
	'use strict';
	angular.module('app', ['ui.router', 'ngMaterial'])
	.config(Config);

	function Config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: '/templates/home.html',
      controller: 'HomeController as vm'
		}).state('Profile',{
			url: '/profile/:id',
			templateUrl: '/templates/profile.html',
			controller: 'ProfileController as ProCon'
		}).state('Icon',{
			url: '/icon/:id',
			templateUrl: '/templates/icon.html',
			controller: 'IconDetailsController as vm'
		});
		$urlRouterProvider.otherwise('/');

	}
})();
