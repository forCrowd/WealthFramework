(function () {
    'use strict';

    var controllerId = 'LoginController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'locationHistory', 'serviceAppUrl', 'logger', '$location', '$rootScope', '$scope', LoginController]);

    function LoginController(dataContext, locationHistory, serviceAppUrl, logger, $location, $rootScope, $scope) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.email = '';
        vm.login = login;
        vm.navigateToResetPassword = navigateToResetPassword;
        vm.password = '';
        vm.rememberMe = true;
        vm.showHeader = typeof $scope.showHeader !== 'undefined' ? $scope.showHeader : true;

        _init();

        function _init() {

            // Error
            var error = $location.search().error;
            if (typeof error !== 'undefined') {
                logger.logError(error, null, true);
                return;
            }

            login();
        }

        function getReturnUrl() {
            // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== 'undefined' ? clientReturnUrl : locationHistory.previousItem().url();
        }

        function login() {

            // External (single use token) login
            var singleUseToken = $location.search().token;
            if (typeof singleUseToken !== 'undefined') {
                dataContext.login('', '', vm.rememberMe, singleUseToken).then(success).catch(failedExternal);
            } else { // Internal login
                if (vm.email !== '' && vm.password !== '') {
                    dataContext.login(vm.email, vm.password, vm.rememberMe).then(success);
                }
            }

            function success() {
                logger.logSuccess('You have been logged in!', null, true);
                $location.url(getReturnUrl());
            }

            function failedExternal() {
                logger.logError('Invalid token', null, true);
            }
        }

        function navigateToResetPassword() {
            $rootScope.$broadcast('LoginController_redirected');
            $location.path('/_system/account/resetPassword');
        }
    }
})();
