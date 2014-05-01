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
        vm.userLogoutNew = userLogoutNew;

        initialize();

        function initialize() {
            getCurrentUserNew();
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

        function getCurrentUserNew() {
            userService.getCurrentUserNew()
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

        function userLogoutNew() {

            logger.logSuccess('arrived 1', null, true);

            userService.logoutNew()
                .success(function () {

                    logger.logSuccess('success 1', null, true);

                    // TODO!
                    window.location.href = '/';
                    vm.currentUser = null;
                    vm.isAuthenticated = false;
                });
        }
    };
})();
