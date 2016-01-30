(function() {
  'use strict';
  angular.module('app')
  .controller('GlobalController', GlobalController)
  .controller('LogRegController', LogRegController);

  function GlobalController(UserFactory, $state, $mdDialog, $scope, $animate) {
    var vm = this;
    vm.user = {};
    vm.status = UserFactory.status;

    vm.register = function(go) {
      $mdDialog.show({
        controller: LogRegController,
        templateUrl: '/templates/modals/register.html',
        parent: angular.element(document.body),
        targetEvent: go,
        clickOutsideToClose: true
      })
      .then(function(user) {
        UserFactory.register(user).then(function(res) {
          $scope.loginprompt = "animated bounceOutLeft";
          $scope.yousuck = "animated bounceInRight";
          vm.ding();
          $state.go('Home');
        });
      });
    };


    vm.login = function(go) {
      $mdDialog.show({
        controller: LogRegController,
        templateUrl: '/templates/modals/login.html',
        parent: angular.element(document.body),
        targetEvent: go,
        clickOutsideToClose: true
      })
      .then(function(user) {
        UserFactory.login(user).then(function(res) {
          $scope.loginprompt = "animated bounceOutLeft";
          $scope.yousuck = "animated bounceInRight";
          vm.ding();
          $state.go('Home');
        });
      });
    };

    vm.logout = function() {
      UserFactory.removeToken();
      $scope.yousuck = "animated bounceOutLeft";
      $scope.loginprompt = "animated bounceInRight";
    };

    vm.loginSFX = function() {
      document.getElementById('loginSFX').play();
    };

    vm.registerSFX = function() {
      document.getElementById('registerSFX').play();
    };

    vm.swoosh = function() {
      document.getElementById('swoosh').play();
    };

    vm.logoutSFX = function() {
      document.getElementById('logout').play();
    };

    vm.ding = function() {
      document.getElementById('ding').play();
    };

  };

  function LogRegController($scope, $mdDialog) {
    $scope.reglog = function() {
      $mdDialog.hide($scope.user);
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
      document.getElementById('close').play();
    };
  };

})();


// vm.oldest = function() {
// 	$scope.tile = "animated bounceOut";
// 	$scope.newbutt = "regButt";
// 	$scope.oldbutt = "animated swing highlight regButt";
// 	$scope.likebutt = "regButt";
// 	$scope.combutt = "regButt";
// 	setTimeout(function(){
// 		vm.icons = null;
// 	}, 250);
// 	setTimeout(function(){
// 		HomeFactory.mostDiscussed().then(function(res) {
// 			vm.icons = res;
// 			$scope.tile = "animated bounceIn";
// 		});
// 	}, 500);
// };
