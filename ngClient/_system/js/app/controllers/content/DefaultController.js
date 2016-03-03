(function () {
    'use strict';

    var controllerId = 'DefaultController';
    angular.module('main')
        .controller(controllerId, ['applicationFactory', 'userFactory', '$scope', '$location', 'disqusShortname', 'logger', DefaultController]);

    function DefaultController(applicationFactory, userFactory, $scope, $location, disqusShortname, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // Local variables
        var anonymousUserWarning = null;

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = { Email: '', isAuthenticated: function () { return false; }, hasPassword: function () { return false; } };
        vm.currentDate = new Date();
        vm.displayBankTransfer = false;
        vm.displayFooterIcons = false;
        vm.disqusConfig = {
            disqus_shortname: disqusShortname,
            disqus_identifier: '',
            disqus_url: ''
        };
        vm.logout = logout;
        vm.toggleBankTransfer = toggleBankTransfer;

        // Events
        $scope.$on('$routeChangeSuccess', routeChangeSuccess);
        $scope.$on('anonymousUserInteracted', anonymousUserInteracted); // Anonymous user warning
        $scope.$on('userFactory_currentUserChanged', currentUserChanged);

        _init();

        /*** Implementations ***/

        function _init() {
            getApplicationInfo();
        }

        function anonymousUserInteracted() {
            if (anonymousUserWarning === null) {
                var warningText = 'To prevent losing your changes, you can register for free or if you have an existing account, please login first.';
                var warningTitle = 'Save your changes?';
                var loggerOptions = { extendedTimeOut: 0, timeOut: 0 };
                anonymousUserWarning = logger.logWarning(warningText, null, true, warningTitle, loggerOptions);
            }
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }

        function getApplicationInfo() {
            applicationFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function logout() {
            userFactory.logout()
                .then(function () {
                    $location.url('/');
                });
        }

        function routeChangeSuccess(event, current, previous) {

            // Footer icons
            vm.displayFooterIcons = $location.path() === '/';

            // Load related disqus
            if (typeof current.enableDisqus !== 'undefined' && current.enableDisqus) {
                vm.disqusConfig.disqus_identifier = disqusShortname + $location.path().replace(/\//g, '_');
                vm.disqusConfig.disqus_url = $location.absUrl().substring(0, $location.absUrl().length - $location.url().length + $location.path().length);
            } else {
                vm.disqusConfig.disqus_identifier = '';
            }

            // Remove anonymousUserWarning toastr in register & login pages, if there is
            if (($location.path() === '/_system/account/register' ||
                $location.path() === '/_system/account/login') &&
                anonymousUserWarning !== null) {
                anonymousUserWarning.remove();
            }
        }

        function toggleBankTransfer() {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }
    }
})();
