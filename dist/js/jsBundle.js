(function () {
    'use strict';
    angular.module('app', ['ui.router', 'ngMaterial']).config(Config);

    function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
        $stateProvider.state('Home', {
            url: '/',
            templateUrl: '/templates/home.html',
            controller: 'HomeController as vm'
        }).state('Profile', {
            url: '/profile/:id',
            templateUrl: '/templates/profile.html',
            controller: 'ProfileController as ProCon'
        }).state('Icon', {
            url: '/icon/:id',
            templateUrl: '/templates/icon.html',
            controller: 'IconDetailsController as vm'
        })
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlMatcherFactoryProvider.strictMode(false);
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');

    }
})();

(function () {
    'use strict';
    angular.module('app').controller('GlobalController', GlobalController).controller('LogRegController', LogRegController);

    function GlobalController(UserFactory, $state, $mdDialog, $scope, $animate) {
        var vm = this;
        vm.user = {};
        vm.status = UserFactory.status;


        vm.register = function (go) {
            $mdDialog.show({
                controller: LogRegController,
                templateUrl: '/templates/modals/register.html',
                parent: angular.element(document.body),
                targetEvent: go,
                clickOutsideToClose: true
            }).then(function (user) {
                UserFactory.register(user).then(function (res) {
                    $scope.loginprompt = "animated bounceOutLeft";
                    $scope.yousuck = "animated bounceInRight";
                    vm.ding();
                    $state.go('Home');
                });
            });
        };


        vm.login = function (go) {
            $mdDialog.show({
                controller: LogRegController,
                templateUrl: '/templates/modals/login.html',
                parent: angular.element(document.body),
                targetEvent: go,
                clickOutsideToClose: true
            }).then(function (user) {
                UserFactory.login(user).then(function (res) {
                    $scope.loginprompt = "animated bounceOutLeft";
                    $scope.yousuck = "animated bounceInRight";
                    vm.ding();
                    $state.go('Home');
                });
            });
        };

        vm.logout = function () {
            UserFactory.removeToken();
            $scope.yousuck = "animated bounceOutLeft";
            $scope.loginprompt = "animated bounceInRight";
        };

        vm.loginSFX = function () {
            document.getElementById('loginSFX').play();
        };

        vm.registerSFX = function () {
            document.getElementById('registerSFX').play();
        };

        vm.swoosh = function () {
            document.getElementById('swoosh').play();
        };

        vm.logoutSFX = function () {
            document.getElementById('logout').play();
        };

        vm.ding = function () {
            document.getElementById('ding').play();
        };

    };

    function LogRegController($scope, $mdDialog) {
        $scope.reglog = function () {
            $mdDialog.hide($scope.user);
        };
        $scope.cancel = function () {
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
(function () {
    'use strict';
    angular.module('app').controller('HomeController', HomeController).controller('ModalController', ModalController).controller('EMController', EMController);

    function HomeController($scope, $state, HomeFactory, UserFactory, $mdDialog, $mdToast) {
        var vm = this;
        vm.icon = {};

        HomeFactory.getAllIcons().then(function (res) {
            vm.icons = res;
            $scope.newbutt = "animated swing highlight regButt";
            $scope.oldbutt = "regButt";
            $scope.likebutt = "regButt";
            $scope.combutt = "regButt";
        });

        vm.refresh = function () {
            HomeFactory.refresh().then(function (res) {
                HomeFactory.getAllIcons.then(function (res) {
                    vm.icons = res;
                });
            });
        };


        vm.addIcon = function (hi) {
            $mdDialog.show({
                controller: ModalController,
                templateUrl: '/templates/modals/addIcon.html',
                parent: angular.element(document.body),
                targetEvent: hi,
                clickOutsideToClose: true
            }).then(function (icon) {
                HomeFactory.addIcon(icon).then(function (res) {
                    res.createdBy = {};
                    res.createdBy._id = UserFactory.status._id;
                    res.createdBy.username = UserFactory.status.username;
                    if (res.createdBy) {
                        document.getElementById('addSuccess').play();
                    }
                    vm.icons.unshift(res);
                    vm.icon = res;
                });
            });
        };

        vm.deleteIcon = function (icon) {
            vm.icons.splice(vm.icons.indexOf(icon), 1);
            HomeFactory.deleteIcon(icon._id).then(function (res) {
                vm.delete();
            });
        };


        vm.editModal = function (evt, icon) {
            $mdDialog.show({
                controller: EMController,
                templateUrl: '/templates/modals/editIconModal.html',
                parent: angular.element(document.body),
                targetEvent: evt,
                clickOutsideToClose: true,
                locals: {
                    icon: icon
                }
            }).then(function (newIcon) {
                HomeFactory.updateIcon(newIcon, icon).then(function (res) {
                    vm.editSuccess();
                    vm.icons[vm.icons.indexOf(icon)] = newIcon;
                });
            });
        };

        vm.like = function (icon) {
            if (!UserFactory.status._id) {
                $mdToast.show(
                $mdToast.simple().content('You must login to like icons!').position('top left').hideDelay(3000));
            };
            if (UserFactory.status._id) {
                for (var i = 0; i < icon.likers.length; i++) {
                    if (icon.likers[i] == UserFactory.status._id) {
                        return console.log('already liked');
                    }
                    else if ((i + 1) >= icon.likers.length) {
                        console.log('in else if');
                        HomeFactory.like(icon._id).then(function (res) {
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
        vm.editSuccess = function () {
            document.getElementById('addSuccess').play();
        };

        vm.addIconSFX = function () {
            document.getElementById('addIconSFX').play();
        };

        vm.shuffle = function () {
            document.getElementById('shuffle').play();
        };

        vm.delete = function () {
            document.getElementById('delete').play();
        };

        vm.likeSFX = function () {
            document.getElementById('like').play();
        };

        vm.editSound = function () {
            document.getElementById('addIconSFX').play();
        };

        //------------------------------------------------------
        //------------------SORTING FUNCTIONS-------------------
        //------------------------------------------------------

        vm.newest = function () {
            $scope.tile = "animated bounceOut";
            $scope.newbutt = "animated swing highlight regButt";
            $scope.oldbutt = "regButt";
            $scope.likebutt = "regButt";
            $scope.combutt = "regButt";
            setTimeout(function () {
                vm.icons = null;
            }, 250);
            setTimeout(function () {
                HomeFactory.getAllIcons().then(function (res) {
                    vm.icons = res;
                    $scope.tile = "animated bounceIn";
                });
            }, 500);
        };

        vm.oldest = function () {
            $scope.tile = "animated bounceOut";
            $scope.newbutt = "regButt";
            $scope.oldbutt = "animated swing highlight regButt";
            $scope.likebutt = "regButt";
            $scope.combutt = "regButt";
            setTimeout(function () {
                vm.icons = null;
            }, 250);
            setTimeout(function () {
                HomeFactory.mostDiscussed().then(function (res) {
                    vm.icons = res;
                    $scope.tile = "animated bounceIn";
                });
            }, 500);
        };

        vm.mostLikes = function () {
            $scope.tile = "animated bounceOut";
            $scope.newbutt = "regButt";
            $scope.oldbutt = "regButt";
            $scope.likebutt = "animated swing highlight regButt";
            $scope.combutt = "regButt";
            setTimeout(function () {
                vm.icons = null;
            }, 250);
            setTimeout(function () {
                HomeFactory.mostLikes().then(function (res) {
                    vm.icons = res;
                    $scope.tile = "animated bounceIn";
                });
            }, 500);
        };

        vm.mostDiscussed = function () {
            $scope.tile = "animated bounceOut";
            $scope.newbutt = "regButt";
            $scope.oldbutt = "regButt";
            $scope.likebutt = "regButt";
            $scope.combutt = "animated swing highlight regButt";
            setTimeout(function () {
                vm.icons = null;
            }, 250);
            setTimeout(function () {
                HomeFactory.mostDiscussed().then(function (res) {
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


        $scope.submit = function () {
            $mdDialog.hide($scope.icon);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            document.getElementById('close').play();
        };
    };

    function EMController($scope, $mdDialog, icon) {
        $scope.colors = ['#e01f1f', '#e09728', '#f0e11c', '#2ddd34', '#1be7e7', '#1d36df', '#8a0cfa', '#e423dd'];

        $scope.icon = angular.copy(icon);
        $scope.update = function () {
            $mdDialog.hide($scope.icon);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            document.getElementById('close').play();
        };
    };

})();

(function () {
    'use strict';
    angular.module('app').controller('IconDetailsController', IconDetailsController).controller('EditComController', EditComController);

    function IconDetailsController($stateParams, $state, CommentFactory, UserFactory, $mdDialog) {
        var vm = this;

        if (!$stateParams.id) $state.go('Home');
        CommentFactory.getIconById($stateParams.id).then(function (res) {
            vm.icon = res;
        });

        vm.addComment = function () {
            CommentFactory.addComment(vm.icon._id, vm.comment).then(function (res) {
                console.log(res);
                res.user = UserFactory.status._id;
                vm.icon.comments.push(res);
                vm.comment = null;
                vm.success();
            });
        };

        vm.deleteComment = function (comment) {
            vm.icon.comments.splice(vm.icon.comments.indexOf(comment), 1);
            CommentFactory.deleteComment(comment._id).then(function (res) {
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
            }).then(function (newcom) {
                CommentFactory.editCom(newcom, comment).then(function (res) {
                    vm.icon.comments[vm.icon.comments.indexOf(comment)] = newcom;
                    vm.success();
                });
            });
        };

        //------------------------------------------------------
        //------------------SOUND FUNCTIONS---------------------
        //------------------------------------------------------
        vm.success = function () {
            document.getElementById('success').play();
        };

        vm.delete = function () {
            document.getElementById('delete').play();
        };

        vm.editSound = function () {
            document.getElementById('addIconSFX').play();
        };

    }

    function EditComController($scope, $mdDialog, comment) {
        $scope.comment = angular.copy(comment);
        $scope.editCom = function () {
            $mdDialog.hide($scope.comment);
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
            document.getElementById('close').play();
        };
    };

})();

(function () {
    'use strict';
    angular.module('app').controller('ProfileController', ProfileController);

    function ProfileController() {
        var vm = this;


    }
})();

(function () {
    'use strict';
    angular.module('app').factory('CommentFactory', CommentFactory);

    function CommentFactory($http, $q, $window) {
        var o = {};

        o.getIconById = function (id) {
            var q = $q.defer();
            $http.get('/api/v1/comments/' + id).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.addComment = function (id, comment) {
            var q = $q.defer();
            $http.post('/api/v1/comments/' + id, comment, {
                headers: {
                    authorization: "Bearer " + $window.localStorage.getItem('token')
                }
            }).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.deleteComment = function (id) {
            var q = $q.defer();
            $http.delete('/api/v1/comments/' + id).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.editCom = function (newCom, oldCom) {
            var q = $q.defer();
            $http.put('/api/v1/comments/' + oldCom._id, newCom).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        return o;
    }
})();

(function () {
    'use strict';
    angular.module('app').factory('HomeFactory', HomeFactory);

    function HomeFactory($http, $q, $window) {
        var o = {};

        o.getAllIcons = function () {
            var q = $q.defer();
            $http.get('/api/v1/icons').then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        }

        o.addIcon = function (icon) {
            var q = $q.defer();
            $http.post('/api/v1/icons', icon, {
                headers: {
                    authorization: "Bearer " + $window.localStorage.getItem("token")
                }
            }).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.deleteIcon = function (id) {
            var q = $q.defer();
            $http.delete('/api/v1/icons/' + id).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.updateIcon = function (newIcon, oldIcon) {
            var q = $q.defer();
            $http.put('/api/v1/icons/' + oldIcon._id, newIcon).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.like = function (id) {
            var q = $q.defer();
            $http.put('/api/v1/icons/like/' + id, null, {
                headers: {
                    authorization: "Bearer " + $window.localStorage.getItem('token')
                }
            }).then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.refresh = function () {
            var q = $q.defer();
            $http.put('/api/v1/icons/refresh').then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        //------------------------------------------------------
        //------------------SORTING FUNCTIONS-------------------
        //------------------------------------------------------
        o.mostLikes = function () {
            var q = $q.defer();
            $http.get('/api/v1/icons/mostLikes').then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.mostDiscussed = function () {
            var q = $q.defer();
            $http.get('/api/v1/icons/mostDiscussed').then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.oldest = function () {
            var q = $q.defer();
            $http.get('/api/v1/icons/oldest').then(function (res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        return o;
    }
})();

(function () {
    'use strict';
    angular.module('app').factory('UserFactory', UserFactory);

    function UserFactory($http, $q, $window) {
        var o = {};
        o.status = {};

        o.register = function (user) {
            var q = $q.defer();
            $http.post('/api/v1/users/register', user).then(function (res) {
                o.setToken(res.data.token);
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.login = function (user) {
            var q = $q.defer();
            $http.post('/api/v1/users/login', user).then(function (res) {
                o.setToken(res.data.token);
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        o.setToken = function (token) {
            $window.localStorage.setItem('token', token);
            o.setUser();
        };

        o.removeToken = function () {
            $window.localStorage.removeItem('token');
            o.status._id = null;
            o.status.email = null;
            o.status.username = null;
        };

        o.setUser = function () {
            var token = JSON.parse(atob(o.getToken().split('.')[1]));
            o.status._id = token._id;
            o.status.email = token.email;
            o.status.username = token.username;
        };

        if (o.getToken()) o.setUser();

        return o;
    }
})();