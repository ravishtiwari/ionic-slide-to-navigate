angular.module('starter.controllers', [])
.factory('modalService', ['$q', '$ionicModal', modalService])
.service('musicService', musicService)
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, modalService) {
  $scope.playlists = [
    { title: 'Reggae adsfas', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

  var animations = ['fade-in-scale', 'fade-in-right', 'fade-in-left', 'road-runner',];

  $scope.gotoDetail = function (item) {
    //console.log(modalService.getControllerConfig());return;
    modalService.create(
      'templates/detail.modal.html', {
        scope: null,
        controller: 'CollegeController',
        animation: animations[getRandomInt(0, animations.length)],
      }, {
        songId: item.id
      }
    ).then(function () {
      modalService.show().then(function () {
      });
    });

    function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams, modalService, musicService) {
  var vm = this;
  vm.song = modalService.controllerConfig();

  function init() {
    vm.song.song = musicService.get(vm.song.songId);
    console.log(vm.song);
    $scope.$broadcast('songLoaded', {song: vm.song, songId: vm.song.songId});
  }
  init();
})

.controller('PlayListDetailModal', ['modalService', '$scope', '$ionicSlideBoxDelegate', 'musicService', PlayListDetailModal]);

function PlayListDetailModal(modalService, $scope, $ionicSlideBoxDelegate, musicService) {
  var vm = this;
  vm.modalService = modalService;
  vm.songConfig = modalService.controllerConfig();
  vm.activeSong = vm.songConfig.songId - 1;
  vm.songs = musicService.getAll();

  vm.onSwipeRight = function (event) {
    var currentIndex = vm.getSlideIndex(), songConfig;
    vm.activeSong = vm.activeSong - 1;
    songConfig = {songId: vm.activeSong};
    event.stopPropagation();
    vm.activeSong = songConfig.songId;
    vm.songConfig = songConfig;
    modalService.setControllerConfig(songConfig);
    $ionicSlideBoxDelegate.previous();
    console.log('Swipe Right');
  };

  vm.onSwipeLeft = function (event) {
    event.stopPropagation();
    var currentIndex = vm.getSlideIndex(), songConfig;
    vm.activeSong = vm.activeSong + 1;
    songConfig = {songId: vm.activeSong };
    event.stopPropagation();
    vm.activeSong = songConfig.songId;
    vm.songConfig = songConfig;
    modalService.setControllerConfig(songConfig);
    $ionicSlideBoxDelegate.next();
    console.log('Swipe Left');
  };

  $scope.$on('songLoaded', function (event, args) {
    console.log('Song Loaded');
    console.log(args.song);
    $ionicSlideBoxDelegate.update();
  });

  vm.getSlideIndex = function () {
    var index = $ionicSlideBoxDelegate.currentIndex();
    return index;
  };
};

function modalService ($q, $ionicModal) {
    var activeModal, defaults = {
        scope: null,
        animation: 'slide-in-up',
    }, controllerConfig;
    return {
        create: create,
        show: show,
        hide: hide,
        close: close,
        destroy: destroy,
        controllerConfig: getControllerConfig,
        setControllerConfig: setControllerConfig
    };

    function create (template, options, ctrlConfig) {
        var config = angular.copy(defaults);
        var deferred = $q.defer();
        angular.merge(config, options);
        setControllerConfig(ctrlConfig);
        $ionicModal.fromTemplateUrl(template, config).then(function (modal) {
            activeModal = modal;
            controllerConfig = ctrlConfig;
            deferred.resolve('MODAL_CREATED');
        }).catch(function () {
            deferred.resolve('MODAL_CREATE_ERROR');
        });

        return deferred.promise;
    }

    function show () {
        var deferred = $q.defer();
        if (angular.isDefined(activeModal)) {
            activeModal.show();
            deferred.resolve('MODAL_SHOWN');
        } else {
            deferred.reject('NO_ACTIVE_MODAL_TO_SHOW');
        }
        return deferred.promise;
    }

    function hide () {
        var deferred = $q.defer();
        if (angular.isDefined(activeModal)) {
            activeModal.hide();
            deferred.resolve('MODAL_HIDDEN');
        } else {
            deferred.reject('NO_ACTIVE_MODAL_TO_HIDE');
        }
        return deferred.promise;
    }

    function getControllerConfig () {
        return controllerConfig;
    }

    function setControllerConfig(config) {
      controllerConfig = config;
    }

    function destroy () {
        var deferred = $q.defer();
        activeModal.remove().then(function () {
            activeModal = null;
            controllerConfig = null;
            deferred.resolve('MODAL_DESTROYED');
        });
        return deferred.promise;
    }

    function close () {
        return hide().then(function () {
            return destroy();
        });
    }
}

function musicService($q) {
  var playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

  return {
    getAll: getAll,
    get: get,
  };

  function getAll() {
    return playlists;
  }

  function get(index) {
    return playlists[index];
  }
}
