(function () {
    'use strict';

    var controllerId = 'DefaultController';
    angular.module('main')
        .controller(controllerId, ['applicationFactory', 'userFactory', '$scope', '$location', 'logger', DefaultController]);

    function DefaultController(applicationFactory, userFactory, $scope, $location, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = null;

        logger.log('vm.currentUser 1', vm.currentUser);

        vm.currentUserText = currentUserText;
        vm.currentDate = new Date();
        vm.hasPassword = hasPassword;
        vm.isAuthenticated = isAuthenticated;
        vm.logout = logout;
        vm.displayAnonymousUserWarning = true;

        // Events
        $scope.$on('anonymousUserInteracted', anonymousUserInteracted); // Anonymous user warning
        $scope.$on('userLoggedIn', userLoggedIn); // User logged in & out
        $scope.$on('userLoggedOut', userLoggedOut);

        _init();

        /*** Implementations ***/

        function _init() {

            // Application info
            getApplicationInfo();

            // Current user
            getCurrentUser();
        }

        function anonymousUserInteracted() {
            if (vm.displayAnonymousUserWarning) {
                logger.logWarning('To prevent losing your changes, you can register for free or if you have an existing account, please login first.',
                    null,
                    true,
                    'Save your changes?',
                    { extendedTimeOut: 0, timeOut: 0 });
                vm.displayAnonymousUserWarning = false;
            }
        }

        function currentUserText() {

            var text = '';

            if (vm.currentUser !== null) {
                //text = 'User: ' + vm.currentUser.Email + ' - ' + vm.currentUser.EmailConfirmed;
                text = 'User: ' + vm.currentUser.Email;
            }

            return text;
        }

        function getApplicationInfo() {
            applicationFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function getCurrentUser() {
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                    logger.log('vm.currentUser 4', vm.currentUser);
                });
        }

        function hasPassword() {

            if (typeof vm.currentUser === 'undefined') {
                logger.log('vm.currentUser is undefined 1');
                vm.currentUser = null;
            }

            return vm.currentUser !== null && vm.currentUser.hasPassword();
        }

        function isAuthenticated() {

            if (typeof vm.currentUser === 'undefined') {
                logger.log('vm.currentUser is undefined 2');
                vm.currentUser = null;
            }

            return vm.currentUser !== null && vm.currentUser.Id > 0;
        }

        function logout() {
            
            userFactory.logout();

            // Return back to home page
            $location.url('/');
        }

        function userLoggedIn(event, currentUser) {
            vm.currentUser = currentUser;
            logger.log('vm.currentUser 2', vm.currentUser);
        }

        function userLoggedOut() {
            vm.currentUser = null;
            logger.log('vm.currentUser 3', vm.currentUser);
        }
    }
})();
