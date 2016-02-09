/**
 * Ionic Modal service.
 * @author Ravish Tiwari <ravishktiwari@hotmail.com>
 * @copyright Copyright (c) 2015, Common App
 */

/**
 * @description
 * @constructor
 */
//(function () {
    'use strict';
    modalService.$inject = ['$q', '$ionicModal', '$cordovaStatusbar'];

    function modalService ($q, $ionicModal, $cordovaStatusbar) {
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
        };

        function create (template, options, ctrlConfig) {
            var config = angular.copy(defaults);
            var deferred = $q.defer();
            angular.merge(config, options);
            controllerConfig = ctrlConfig;
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
                if ($window.StatusBar) {
                  $cordovaStatusbar.style(0);
                }
                deferred.resolve('MODAL_HIDDEN');
            } else {
                deferred.reject('NO_ACTIVE_MODAL_TO_HIDE');
            }
            return deferred.promise;
        }

        function getControllerConfig () {
            return controllerConfig;
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


    //module.exports = modalService;
//}());
