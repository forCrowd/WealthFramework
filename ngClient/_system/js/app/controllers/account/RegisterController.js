(function () {
    'use strict';

    var controllerId = 'RegisterController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'locationHistory', 'serviceAppUrl', 'logger', '$location', '$rootScope', '$scope', RegisterController]);

    function RegisterController(dataContext, locationHistory, serviceAppUrl, logger, $location, $rootScope, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.ConfirmPassword = '';
        vm.Email = '';
        vm.IsAnonymous = false;
        vm.IsAnonymousChanged = IsAnonymousChanged;
        vm.Password = '';
        vm.register = register;
        vm.rememberMe = true;
        vm.showHeader = typeof $scope.showHeader !== 'undefined' ? $scope.showHeader : true;
        vm.UserName = '';

        function register() {

            if (vm.IsAnonymous) {
                dataContext.registerAnonymous(vm, vm.rememberMe)
                    .then(function () {
                        logger.logSuccess('You have been registered!', null, true);
                        $rootScope.$broadcast('RegisterController_userRegistered');
                        if ($location.path() === '/_system/account/register') {
                            $location.url(locationHistory.previousItem().url());
                        }
                    })
                    .catch(failed);
            } else {
                dataContext.register(vm, vm.rememberMe)
                    .then(function () {
                        logger.logSuccess('You have been registered!', null, true);
                        $rootScope.$broadcast('RegisterController_userRegistered');
                        $location.url('/_system/account/confirmEmail');
                    })
                    .catch(failed);
            }

            function failed(response) {
                if (typeof response.error_description !== 'undefined') {
                    logger.logError(response.error_description, null, true);
                }
            }
        }

        function IsAnonymousChanged() {
            vm.UserName = vm.IsAnonymous ? dataContext.getUniqueUserName() : '';
            vm.Email = vm.IsAnonymous ? dataContext.getUniqueEmail() : '';
        }
    }
})();
