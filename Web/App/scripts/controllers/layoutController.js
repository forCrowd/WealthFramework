(function () {
    'use strict';

    var controllerId = 'layoutController';
    angular.module('main')
        .controller(controllerId, ['mainService', 'userService', '$rootScope', '$location', 'logger', layoutController]);

    function layoutController(mainService, userService, $rootScope, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.applicationInfo = null;
        vm.currentDate = new Date();
        vm.logout = logout;
        vm.resetSampleData = resetSampleData;
        vm.userInfo = null;

        initialize();

        function initialize() {
            getApplicationInfo();
            getUserInfo();

            // User logged in
            $rootScope.$on('userLoggedIn', function () {
                getUserInfo();
            });

            // User logged out
            $rootScope.$on('userLoggedOut', function () {
                vm.userInfo = null;
            });
        };

        function getApplicationInfo() {
            mainService.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                });
        }

        function getUserInfo() {
            userService.getUserInfo()
                .then(function (userInfo) {
                    vm.userInfo = userInfo;
                }, function () {
                    // TODO Error?
                });
        }

        function logout() {
            userService.logout()
                .success(function () {
                    $location.path('/');
                });
        }

        function resetSampleData() {
            if (confirm('Are you sure you want to reset your sample data?')) {
                userService.resetSampleData()
                    .success(function () {
                        $location.path('/');
                        logger.logSuccess('Your sample data was reset!', null, true);
                    });
            }
        }
    };
})();
