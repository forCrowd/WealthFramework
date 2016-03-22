(function () {
    'use strict';

    var controllerId = 'ChangeUserNameController';
    angular.module('main')
        .controller(controllerId, ['dataContext', '$location', 'logger', ChangeUserNameController]);

    function ChangeUserNameController(dataContext, $location, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.cancel = cancel;
        vm.changeUserName = changeUserName;
        vm.currentUser =  { UserName: '' };
        vm.externalLoginInit = $location.search().init; // For external login's
        vm.isChangeUserNameDisabled = false;
        vm.isSaveDisabled = isSaveDisabled;
        vm.userName = '';

        _init();

        function _init() {

            dataContext.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                    vm.userName = currentUser.UserName;

                    // Generate test data if localhost
                    if ($location.host() === 'localhost') {
                        vm.userName = dataContext.getUniqueUserName();
                    }
                });
        }

        function cancel() {
            $location.url(getReturnUrl());
        }

        function changeUserName() {

            vm.isChangeUserNameDisabled = true;

            dataContext.changeUserName({ UserName: vm.userName })
                .success(function () {
                    logger.logSuccess('Your username has been changed!', null, true);
                    $location.url(getReturnUrl());
                })
                .finally(function () {
                    vm.isChangeUserNameDisabled = false;
                });
        }

        function getReturnUrl() {
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== 'undefined' ?
                clientReturnUrl :
                '/_system/account';
        }

        function isSaveDisabled() {
            return vm.userName === vm.currentUser.UserName || vm.isChangeUserNameDisabled;
        }
    }
})();
