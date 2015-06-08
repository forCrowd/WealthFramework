(function () {
    'use strict';

    var controllerId = 'mainController';
    angular.module('main')
        .controller(controllerId, ['mainService',
            'userService',
            '$rootScope',
            '$location',
            '$window',
            'logger',

            'resourcePoolFactory', // Just for test, remove
            'resourcePoolService',

            mainController]);

    function mainController(mainService,
        userService,
        $rootScope,
        $location,
        $window,
        logger,

        resourcePoolFactory, // Just for test, remove
        resourcePoolService

        ) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.applicationInfo = null;
        vm.currentDate = new Date();
        vm.logout = logout;
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
                vm.userInfo = { Id: 0 };
            });
        };

        function getApplicationInfo() {
            mainService.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
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
    };
})();
