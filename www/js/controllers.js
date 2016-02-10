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

.controller('PlaylistsCtrl', function($scope, modalService, musicService) {
  $scope.playlists = musicService.getAll();

  var animations = ['fade-in-right', 'fade-in-left'];

  $scope.gotoDetail = function (index, item) {
    modalService.create(
      'templates/detail.modal.html', {
        scope: null,
        controller: 'CollegeController',
        animation: animations[getRandomInt(0, animations.length)],
      }, {
        active: index,
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

.controller('PlaylistCtrl', function($scope, $stateParams, modalService, musicService, $rootScope) {
  var vm = this;
  vm.song = modalService.controllerConfig();

  function init() {
    vm.song.song = musicService.get(vm.song.active);
    console.log(vm.song);
    $rootScope.$broadcast('songLoaded', {song: vm.song, songId: vm.song.id});
  }
  init();
})

.controller('PlayListDetailModal', ['modalService', '$scope', '$ionicSlideBoxDelegate', 'musicService', '$timeout', '$rootScope', '$ionicLoading', PlayListDetailModal])
.directive('watchSlides', function($interval, $timeout) {
    return {
        restrict: 'A',
        require: 'ionSlideBox',
        link: function(scope, el, attrs, slider) {

            var index = 0;

            var activeWatcher = scope.$watch(function getActiveSlide() {
                index = slider.__slider.selected();
                return [index, slider.__slider.count()];
            }, changeSize, true);


            scope.$watch(function() {
                return _.size(scope.$eval(attrs.watchSlides));
            }, function(val) {
                slider.__slider.update();
            });

            var interval = $interval(changeSize, 1000);

            // Cleanup
            scope.$on('$destroy', function() {
                activeWatcher();
                $interval.cancel(interval);
            });



            function changeSize() {

                if (!el[0].querySelectorAll('.slider-slide').length) {
                    return;
                }

                var newHeight = el[0].querySelectorAll('.slider-slide')[index].scrollHeight;
                if (newHeight) {
                    $timeout(function() {
                        el.css({
                            height: newHeight + 'px'
                        });
                    });
                }
            }


        }
    };
});
function PlayListDetailModal(modalService, $scope, $ionicSlideBoxDelegate, musicService, $timeout, $rootScope, $ionicLoading) {
  var vm = this;
  vm.modalService = modalService;
  vm.songConfig = modalService.controllerConfig();
  vm.activeSong = vm.songConfig.active;
  vm.songs = musicService.getAll();

  vm.slideChanged = function (index) {
    $ionicLoading.show({
          content: '',
          animation: 'fade-out',
          showBackdrop: false,
          maxWidth: 200,
          showDelay: 0,
        });
    console.log(index);
    vm.activeSong = index;
    modalService.setControllerConfig({active: index});
    $timeout(function () {
      $ionicSlideBoxDelegate.update();
    }, 0);
  };

  $rootScope.$on('songLoaded', function (event, args) {
    console.log('Song Loaded');
    console.log(args.song);
    $ionicSlideBoxDelegate.update();
    $timeout(function () {
      $ionicLoading.hide();
    }, 1000);

  });
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
    { title: 'Reggae', id: 1 , detail: 'Lorizzle ipsum bling bling sit amizzle, consectetuer adipiscing elit. Nizzle sapien velizzle, bling bling volutpat, suscipit , gravida vel, arcu. Check it out hizzle that\'s the shizzle. We gonna chung erizzle. Fo izzle dolor fo turpis tempizzle tempor. Gangsta boom shackalack mofo et turpizzle. Sizzle izzle tortor. Pellentesque uhuh ... yih!'},
    { title: 'Chill', id: 2, detail: 'Excuse me, I\'d like to ASS you a few questions. Hey, maybe I will give you a call sometime. Your number still 911? Look at that, it\'s exactly three seconds before I honk your nose and pull your underwear over your head. We got no food we got no money and our pets heads are falling off! Haaaaaaarry.' },
    { title: 'Dubstep', id: 3, detail: 'Cupcake ipsum dolor sit. Amet I love liquorice jujubes pudding croissant I love pudding. Apple pie macaroon toffee jujubes pie tart cookie applicake caramels. Halvah macaroon I love lollipop. Wypas I love pudding brownie cheesecake tart jelly-o. Bear claw cookie chocolate bar jujubes toffee.' },
    { title: 'Indie', id: 4, detail: 'Bacon ipsum dolor sit amet salami jowl corned beef, andouille flank tongue ball tip kielbasa pastrami tri-tip meatloaf short loin beef biltong. Cow bresaola ground round strip steak fatback meatball shoulder leberkas pastrami sausage corned beef t-bone pork belly drumstick.' },
    { title: 'Rap', id: 5, detail: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.' },
    { title: 'Cowbell', id: 6, detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet ut magna vitae tincidunt. Proin nec tristique justo. Pellentesque pharetra sem eu tincidunt feugiat. Nullam a pellentesque ex. Curabitur porta mauris vel risus pretium semper. Donec commodo facilisis odio. Etiam consequat euismod consequat. Mauris faucibus vulputate orci, ut varius turpis consectetur eget. ' }
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
