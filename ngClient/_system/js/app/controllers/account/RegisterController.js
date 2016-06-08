(function () {
    'use strict';

    var controllerId = 'RegisterController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'locationHistory', 'logger', 'serviceAppUrl', '$location', '$rootScope', '$scope', RegisterController]);

    function RegisterController(dataContext, locationHistory, logger, serviceAppUrl, $location, $rootScope, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.bindingModel = {
            UserName: '',
            Email: '',
            Password: '',
            ConfirmPassword: ''
        };
        vm.isSaving = false;
        vm.isSaveDisabled = isSaveDisabled;
        vm.register = register;
        vm.rememberMe = true;
        vm.showHeader = typeof $scope.showHeader !== 'undefined' ? $scope.showHeader : true;

        function isSaveDisabled() {
            return vm.isSaving;
        }

        function register() {

            vm.isSaving = true;

            dataContext.register(vm.bindingModel, vm.rememberMe)
                .then(function () {
                    logger.logSuccess('You have been registered!', null, true);
                    $location.url('/_system/account/confirmEmail');
                })
                .catch(failed)
                .finally(function () {
                    vm.isSaving = false;
                });

            function failed(response) {
                if (typeof response.error_description !== 'undefined') {
                    logger.logError(response.error_description, null, true);
                }
            }
        }
    }
})();
