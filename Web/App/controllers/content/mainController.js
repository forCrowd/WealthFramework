(function () {
    'use strict';

    var controllerId = 'mainController';
    angular.module('main')
        .controller(controllerId, ['mainFactory', 'userFactory', '$scope', '$location', '$window', 'logger', mainController]);

    function mainController(mainFactory, userFactory, $scope, $location, $window, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = null;
        vm.currentDate = new Date();
        vm.isAuthenticated = isAuthenticated;
        vm.logout = logout;

        // User logged in
        $scope.$on('userLoggedIn', function () {
            getCurrentUser();
        });

        _init();

        function _init() {
            // Application info
            getApplicationInfo();

            // Current user
            getCurrentUser();
        }

        function getApplicationInfo() {
            mainFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function getCurrentUser() {
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                });
        }

        function isAuthenticated() {
            return vm.currentUser !== null && vm.currentUser.Id > 0;
        }

        function logout() {
            userFactory.logout()
                .success(function () {
                    // Reset current user and go back to home
                    vm.currentUser = null;
                    $location.path('/');
                });
        }
    };
})();
