(function () {
    'use strict';

    var controllerId = 'userController';
    angular.module('main')
        .controller(controllerId, ['userService', '$location', 'logger', userController]);

    function userController(userService, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getAccessToken = getAccessToken;

        initialize();

        function initialize() {
        };

        function getAccessToken() {
            userService.getAccessToken(vm.email, vm.password)
                .success(function () {
                    $location.path('/');
                });
        }
    };
})();
