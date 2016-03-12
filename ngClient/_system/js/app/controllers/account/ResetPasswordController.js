(function () {
    'use strict';

    var controllerId = 'ResetPasswordController';
    angular.module('main')
        .controller(controllerId, ['dataContext', '$location', 'logger', ResetPasswordController]);

    function ResetPasswordController(dataContext, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.email = $location.search().email;
        vm.token = $location.search().token;
        vm.resetPassword = resetPassword;
        vm.resetPasswordRequest = resetPasswordRequest;
        vm.viewMode = typeof $location.search().email === 'undefined' || typeof $location.search().token === 'undefined' ?
            'initial' :
            'received'; // initial | sent | received

        /*** Implementations ***/

        function resetPassword() {
            // var resetPasswordBindingModel = { Token: vm.token, NewPassword: vm.newPassword, ConfirmPassword: vm.confirmPassword };
            var resetPasswordBindingModel = vm;
            dataContext.resetPassword(resetPasswordBindingModel)
                .success(function () {
                    $location.url('/_system/account/login');
                    logger.logSuccess('Your password has been reset!', null, true);
                });
        }

        function resetPasswordRequest() {
            var resetPasswordRequestBindingModel = vm;
            dataContext.resetPasswordRequest(resetPasswordRequestBindingModel)
                .success(function () {
                    vm.viewMode = 'sent';
                });
        }
    }
})();
