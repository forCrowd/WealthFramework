(function () {
    'use strict';

    var controllerId = 'AddPasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', '$location', 'logger', AddPasswordController]);

    function AddPasswordController(dataContext, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.addPassword = addPassword;

        function addPassword() {
            dataContext.addPassword(vm)
                .success(function () {
                    $location.url('/');
                    logger.logSuccess('Your password has been set!', null, true);
                });
        }
    }
})();
