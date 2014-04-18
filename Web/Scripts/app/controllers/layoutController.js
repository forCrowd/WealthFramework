(function () {
    'use strict';

    var controllerId = 'layoutController';
    angular.module('main')
        .controller(controllerId, ['mainService', 'userService', 'logger', layoutController]);

    function layoutController(mainService, userService, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentDate = new Date();
        vm.currentVersion = '';
        vm.isAuthenticated = false;
        vm.userLogout = userLogout;

        initialize();

        function initialize() {
            getCurrentVersion();
        };

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
                });
        }
    };
})();
