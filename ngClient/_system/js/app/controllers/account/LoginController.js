(function () {
    'use strict';

    var controllerId = 'LoginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'locationHistory', 'serviceAppUrl', 'logger', LoginController]);

    function LoginController(userFactory, $location, locationHistory, serviceAppUrl, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.email = '';
        vm.login = login;
        vm.getExternalLoginUrl = getExternalLoginUrl;
        vm.password = '';
        vm.rememberMe = false;

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

        function login() {

            // External (temp token) login
            var tempToken = $location.search().tempToken;
            if (typeof tempToken !== 'undefined') {
                userFactory.getToken('', '', vm.rememberMe, tempToken).then(success).catch(failedExternal);
            } else { // Internal login
                if (vm.email !== '' && vm.password !== '') {
                    userFactory.getToken(vm.email, vm.password, vm.rememberMe).then(success);
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

        function getExternalLoginUrl(provider) {
            return serviceAppUrl + '/api/Account/ExternalLogin?provider=' + provider + '&clientReturnUrl=' + getReturnUrl();
        }

        function getReturnUrl() {
            // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== 'undefined' ? clientReturnUrl : locationHistory.previousItem().url();
        }
    }
})();
