(function () {
    'use strict';

    var controllerId = 'DefaultController';
    angular.module('main')
        .controller(controllerId, ['applicationFactory', 'userFactory', '$scope', '$location', 'logger', DefaultController]);

    function DefaultController(applicationFactory, userFactory, $scope, $location, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // Local variables
        var anonymousUserWarning = null;

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = { Email: '', isAuthenticated: function () { return false; }, hasPassword: function () { return false; } };
        vm.currentDate = new Date();
        vm.logout = logout;

        // Events
        $scope.$on('$routeChangeSuccess', routeChangeSuccess);
        $scope.$on('anonymousUserInteracted', anonymousUserInteracted); // Anonymous user warning
        $scope.$on('userFactory_currentUserChanged', currentUserChanged);

        _init();

        /*** Implementations ***/

        function _init() {
            getApplicationInfo();
        }

        function anonymousUserInteracted() {
            if (anonymousUserWarning === null) {
                var warningText = 'To prevent losing your changes, you can register for free or if you have an existing account, please login first.';
                var warningTitle = 'Save your changes?';
                var loggerOptions = { extendedTimeOut: 0, timeOut: 0 };
                anonymousUserWarning = logger.logWarning(warningText, null, true, warningTitle, loggerOptions);
            }
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }

        function getApplicationInfo() {
            applicationFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function logout() {
            userFactory.logout()
                .then(function () {
                    $location.url('/');
                });
        }

        // Remove anonymousUserWarning toastr in register & login pages, if there is
        function routeChangeSuccess(event, next, current) {
            var path = next.$$route.originalPath;
            if (path === '/account/register' || path === 'account/login') {
                if (anonymousUserWarning !== null) {
                    anonymousUserWarning.remove();
                }
            }
        }
    }
})();
