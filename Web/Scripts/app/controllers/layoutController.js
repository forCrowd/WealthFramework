(function () {
    'use strict';

    var controllerId = 'layoutController';
    angular.module('main')
        .controller(controllerId, ['mainService', 'userService', 'logger', layoutController]);

    function layoutController(mainService, userService, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentDate = new Date();
        vm.currentUser = null;
        vm.currentVersion = '';
        vm.isAuthenticated = false;
        vm.userLogout = userLogout;

        initialize();

        function initialize() {
            logger.logSuccess('initialize', null, true);
            getCurrentUser();
            getCurrentVersion();
        };

        function getCurrentUser() {
            userService.getCurrentUser()
                .success(function (currentUser) {
                    // TODO Why string null?
                    vm.isAuthenticated = currentUser !== "null";
                    vm.currentUser = currentUser;
                });
        }

        function getCurrentVersion() {
            mainService.getCurrentVersion()
                .success(function (applicationInfo) {
                    vm.currentVersion = applicationInfo.CurrentVersion;
                });
        }

        function userLogout() {
            userService.logout()
                .success(function () {
                    // TODO!
                    window.location.href = '/';
                    vm.currentUser = null;
                    vm.isAuthenticated = false;
                });
        }
    };
})();
