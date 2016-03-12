(function () {
    'use strict';

    var controllerId = 'DefaultController';
    angular.module('main')
        .controller(controllerId, ['applicationFactory', 'dataContext', '$scope', '$location', 'disqusShortname', '$uibModal', 'logger', DefaultController]);

    function DefaultController(applicationFactory, dataContext, $scope, $location, disqusShortname, $uibModal, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = { Email: '', isAuthenticated: function () { return false; }, HasPassword: false };
        vm.currentDate = new Date();
        vm.currentUserText = currentUserText;
        vm.displayBankTransfer = false;
        vm.displayFooterIcons = false;
        vm.disqusConfig = {
            disqus_shortname: disqusShortname,
            disqus_identifier: '',
            disqus_url: ''
        };
        vm.logout = logout;
        vm.toggleBankTransfer = toggleBankTransfer;
        var isModalOpen = false;

        // Events
        $scope.$on('dataContext_unauthenticatedUserInteracted', openRegisterLoginModal);
        $scope.$on('dataContext_currentUserChanged', currentUserChanged);
        $scope.$on('$routeChangeSuccess', routeChangeSuccess);

        _init();

        /*** Implementations ***/

        function _init() {
            getApplicationInfo();
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }

        function currentUserText() {
            var userText = vm.currentUser.Email;

            if (vm.currentUser.IsAnonymous) {
                userText += ' (Anonymous)';
            }

            return userText;
        }

        function getApplicationInfo() {
            applicationFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function logout() {
            dataContext.logout()
                .then(function () {
                    $location.url('/');
                });
        }

        function openRegisterLoginModal() {
            if (!isModalOpen) {
                isModalOpen = true;

                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.$on('dataContext_currentUserChanged', closeModal);
                        $scope.$on('LoginController_redirected', closeModal);

                        function closeModal() {
                            $uibModalInstance.close();
                        }
                    }],
                    keyboard: false,
                    size: 'lg',
                    templateUrl: '/_system/views/account/registerLogin.html?v=0.50.0'
                });

                modalInstance.result.then(function () {
                    isModalOpen = false;
                });
            }
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
        }

        function toggleBankTransfer() {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }
    }
})();
