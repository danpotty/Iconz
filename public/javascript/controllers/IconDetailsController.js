(function() {
  'use strict';
  angular.module('app')
  .controller('IconDetailsController', IconDetailsController)
  .controller('EditComController', EditComController);

  function IconDetailsController($stateParams, $state, CommentFactory, UserFactory, $mdDialog) {
    var vm = this;

    if(!$stateParams.id) $state.go('Home');
    CommentFactory.getIconById($stateParams.id).then(function(res) {
      vm.icon = res;
    });

    vm.addComment = function() {
      CommentFactory.addComment(vm.icon._id, vm.comment).then(function(res) {
        console.log(res);
        res.user = UserFactory.status._id;
        vm.icon.comments.push(res);
        vm.comment = null;
        vm.success();
      });
    };

    vm.deleteComment = function(comment) {
      vm.icon.comments.splice(vm.icon.comments.indexOf(comment), 1);
      CommentFactory.deleteComment(comment._id).then(function(res) {
        vm.delete();
      });
    };

    vm.editCom = function (init, comment) {
      $mdDialog.show({
        controller: EditComController,
        templateUrl: '/templates/modals/editCom.html',
        parent: angular.element(document.body),
        targetEvent: init,
        clickOutsideToClose: true,
        locals: {
          comment: comment
        }
      })
      .then(function(newcom) {
        CommentFactory.editCom(newcom, comment).then(function(res) {
          vm.icon.comments[vm.icon.comments.indexOf(comment)] = newcom;
          vm.success();
        });
      });
    };

    //------------------------------------------------------
    //------------------SOUND FUNCTIONS---------------------
    //------------------------------------------------------

    vm.success = function() {
      document.getElementById('success').play();
    };

    vm.delete = function() {
      document.getElementById('delete').play();
    };

    vm.editSound = function() {
      document.getElementById('addIconSFX').play();
    };

  }

  function EditComController($scope, $mdDialog, comment) {
    $scope.comment = angular.copy(comment);
    $scope.editCom = function() {
      $mdDialog.hide($scope.comment);
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
      document.getElementById('close').play();
    };
  };

})();
