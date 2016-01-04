(function () {
    'use strict';

    var controllerId = 'addPasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', addPasswordController]);

    function addPasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.addPassword = addPassword;

        function addPassword() {
            userFactory.addPassword(vm)
                .success(function () {
                    $location.path('/');
                    logger.logSuccess('Your password has been set!', null, true);
                })
                .error(function (data) {

                    var message = data.Message;

                    if (typeof data.ModelState['model.Password'] !== 'undefined') {
                        var errors = data.ModelState['model.Password'];
                        for (var i = 0; i < errors.length; i++) {
                            message += '<br />' + errors[i];
                        }
                    }

                    if (typeof data.ModelState['model.Password'] !== 'undefined') {
                        var errors = data.ModelState['model.Password'];
                        for (var i = 0; i < errors.length; i++) {
                            message += '<br />' + errors[i];
                        }
                    }

                    logger.logError(message, null, true);
                });
        }
    };
})();
