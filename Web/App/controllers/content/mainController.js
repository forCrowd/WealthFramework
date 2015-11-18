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

        // Application info
        mainFactory.getApplicationInfo()
            .then(function (applicationInfo) {
                vm.applicationInfo = applicationInfo;
                vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
            });

        // Current user
        userFactory.getCurrentUser()
            .then(function (currentUser) {
                vm.currentUser = currentUser;
            });

        // User logged in
        $scope.$on('userLoggedIn', function (event, args) {
            vm.currentUser = args.currentUser;
        });

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
