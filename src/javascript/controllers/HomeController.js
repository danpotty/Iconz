(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController)
	.controller('ModalController', ModalController)
	.controller('EMController', EMController);

	function HomeController($scope, $state, HomeFactory, UserFactory, $mdDialog, $mdToast) {
		var vm = this;
		vm.icon = {};
		vm.showTiles = true;

		HomeFactory.getAllIcons().then(function(res) {
				vm.icons = res;
				$scope.newbutt = "animated swing highlight regButt";
				$scope.oldbutt = "regButt";
				$scope.likebutt = "regButt";
				$scope.combutt = "regButt";
		});

		vm.refresh = function() {
			HomeFactory.refresh().then(function(res) {
				HomeFactory.getAllIcons.then(function(res) {
					vm.icons = res;
				});
			});
		};


		vm.addIcon = function(hi) {
			$mdDialog.show({
				controller: ModalController,
				templateUrl: '/templates/modals/addIcon.html',
				parent: angular.element(document.body),
				targetEvent: hi,
				clickOutsideToClose: true
			})
			.then(function(icon) {
				HomeFactory.addIcon(icon).then(function(res) {
					res.createdBy = {};
					res.createdBy._id = UserFactory.status._id;
					res.createdBy.username = UserFactory.status.username;
					if(res.createdBy) {
						document.getElementById('addSuccess').play();
					}
					vm.icons.unshift(res);
					vm.icon = res;
				});
			});
		};

		vm.deleteIcon = function(icon) {
			vm.icons.splice(vm.icons.indexOf(icon), 1);
			HomeFactory.deleteIcon(icon._id).then(function(res) {
				vm.delete();
			});
		};


		vm.editModal = function(evt, icon) {
			$mdDialog.show({
				controller: EMController,
				templateUrl: '/templates/modals/editIconModal.html',
				parent: angular.element(document.body),
				targetEvent: evt,
				clickOutsideToClose: true,
				locals: {
					icon: icon
				}
			})
			.then(function(newIcon) {
				HomeFactory.updateIcon(newIcon, icon).then(function(res) {
					vm.editSuccess();
					vm.icons[vm.icons.indexOf(icon)] = newIcon;
				});
			});
		};

		vm.like = function(icon) {
			if(!UserFactory.status._id) {
				$mdToast.show(
					$mdToast.simple()
					.content('You must login to like icons!')
					.position('top left')
					.hideDelay(3000)
				);
			};
			if(UserFactory.status._id){
				for (var i = 0; i < icon.likers.length; i++) {
					if(icon.likers[i] == UserFactory.status._id) {
						return console.log('already liked');
					}
					else if ((i + 1) >= icon.likers.length) {
						console.log('in else if');
						HomeFactory.like(icon._id).then(function(res) {
							icon.likes++;
							icon.likers.push(UserFactory.status._id);
							vm.likeSFX();
							console.log('like saved');
						});
						return
					};
				};
			};
		};

		//------------------------------------------------------
		//------------------SOUND FUNCTIONS---------------------
		//------------------------------------------------------

		vm.editSuccess = function() {
			document.getElementById('addSuccess').play();
		};

		vm.addIconSFX = function() {
			document.getElementById('addIconSFX').play();
		};

		vm.shuffle = function() {
			document.getElementById('shuffle').play();
		};

		vm.delete = function() {
			document.getElementById('delete').play();
		};

		vm.likeSFX = function() {
			document.getElementById('like').play();
		};

		vm.editSound = function() {
			document.getElementById('addIconSFX').play();
		};

		//------------------------------------------------------
		//------------------SORTING FUNCTIONS-------------------
		//------------------------------------------------------


		vm.newest = function() {
			$scope.tile = "animated bounceOut";
			$scope.newbutt = "animated swing highlight regButt";
			$scope.oldbutt = "regButt";
			$scope.likebutt = "regButt";
			$scope.combutt = "regButt";
			setTimeout(function(){
				vm.showTiles = false;
			}, 250);
			setTimeout(function(){
				HomeFactory.getAllIcons().then(function(res) {
					vm.icons = res;
					$scope.tile = "animated bounceIn";
					vm.showTiles = true;
				});
			}, 500);
		};

		vm.oldest = function() {
			$scope.tile = "animated bounceOut";
			$scope.newbutt = "regButt";
			$scope.oldbutt = "animated swing highlight regButt";
			$scope.likebutt = "regButt";
			$scope.combutt = "regButt";
			setTimeout(function(){
				vm.icons = null;
			}, 250);
			setTimeout(function(){
				HomeFactory.mostDiscussed().then(function(res) {
					vm.icons = res;
					$scope.tile = "animated bounceIn";
				});
			}, 500);
		};

		vm.mostLikes = function() {
			$scope.tile = "animated bounceOut";
			$scope.newbutt = "regButt";
			$scope.oldbutt = "regButt";
			$scope.likebutt = "animated swing highlight regButt";
			$scope.combutt = "regButt";
			setTimeout(function(){
				vm.icons = null;
			}, 250);
			setTimeout(function(){
				HomeFactory.mostLikes().then(function(res) {
					vm.icons = res;
					$scope.tile = "animated bounceIn";
				});
			}, 500);
		};

		vm.mostDiscussed = function() {
			$scope.tile = "animated bounceOut";
			$scope.newbutt = "regButt";
			$scope.oldbutt = "regButt";
			$scope.likebutt = "regButt";
			$scope.combutt = "animated swing highlight regButt";
			setTimeout(function(){
				vm.icons = null;
			}, 250);
			setTimeout(function(){
				HomeFactory.mostDiscussed().then(function(res) {
					vm.icons = res;
					$scope.tile = "animated bounceIn";
				});
			}, 500);
		};


		//------------------------------------------------------
		//------------------MODAL FUNCTIONS---------------------
		//------------------------------------------------------


	};

	function ModalController($scope, $mdDialog) {
		$scope.colors = ['#e01f1f', '#e09728', '#f0e11c', '#2ddd34', '#1be7e7', '#1d36df', '#8a0cfa', '#e423dd'];
		$scope.colorNames = ['Red', 'Orange', 'Yellow', 'Green', 'Teal', 'Blue', 'Purple', 'Pink'];


		$scope.submit = function() {
			$mdDialog.hide($scope.icon);
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
			document.getElementById('close').play();
		};
	};

	function EMController($scope, $mdDialog, icon) {
		$scope.colors = ['#e01f1f', '#e09728', '#f0e11c', '#2ddd34', '#1be7e7', '#1d36df', '#8a0cfa', '#e423dd'];

		$scope.icon = angular.copy(icon);
		$scope.update = function() {
			$mdDialog.hide($scope.icon);
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
			document.getElementById('close').play();
		};
	};

})();
