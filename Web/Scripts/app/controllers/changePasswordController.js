(function () {
    'use strict';

    var controllerId = 'changePasswordController';
    angular.module('main')
        .controller(controllerId, ['userService', '$location', 'logger', changePasswordController]);

    function changePasswordController(userService, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.changePassword = changePassword;

        function changePassword() {
            userService.changePassword(vm)
                .success(function () {
                    $location.path('/');
                    logger.logSuccess('Your password has been changed!', null, true);
                })
                .error(function (data) {

                    var message = data.Message;

                    if (typeof data.ModelState['model.CurrentPassword'] !== 'undefined') {
                        var errors = data.ModelState['model.CurrentPassword'];
                        for (var i = 0; i < errors.length; i++) {
                            message += '<br />' + errors[i];
                        }
                    }

                    if (typeof data.ModelState['model.NewPassword'] !== 'undefined') {
                        var errors = data.ModelState['model.NewPassword'];
                        for (var i = 0; i < errors.length; i++) {
                            message += '<br />' + errors[i];
                        }
                    }

                    if (typeof data.ModelState['model.ConfirmPassword'] !== 'undefined') {
                        var errors = data.ModelState['model.ConfirmPassword'];
                        for (var i = 0; i < errors.length; i++) {
                            message += '<br />' + errors[i];
                        }
                    }

                    logger.logError(message, null, true);
                });
        }
    };
})();
