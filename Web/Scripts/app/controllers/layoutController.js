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
        vm.currentUser = null;
        vm.logout = logout;
        initialize();

        function initialize() {
            getApplicationInfo();

            // If the route changes, try to load the current user
            $rootScope.$on('$routeChangeSuccess', function (next, current) {
                logger.logSuccess('$routeChangeSuccess', { next: next, current: current }, true);
                if (current.loadedTemplateUrl === 'ViewsNg/home/index.html') {
                    getCurrentUser();
                }
            });
        };

        function getApplicationInfo() {
            mainService.getApplicationInfo().then(function (applicationInfo) {
                vm.applicationInfo = applicationInfo;
            });
        }

        function getCurrentUser() {
            userService.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                });
        }

        function logout() {
            userService.logout()
                .success(function () {
                    vm.currentUser = null;
                    $location.path('/');
                });
        }
    };
})();
