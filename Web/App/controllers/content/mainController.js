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
        vm.currentUser = null;

        initialize();

        function initialize() {
            getApplicationInfo();
            getCurrentUser();

            // User logged in
            $rootScope.$on('userLoggedIn', function () {
                getCurrentUser();
            });

            // User logged out
            $rootScope.$on('userLoggedOut', function () {
                vm.currentUser = { Id: 0 };
            });
        };

        function getApplicationInfo() {
            mainService.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
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
