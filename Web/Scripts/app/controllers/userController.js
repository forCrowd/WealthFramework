(function () {
    'use strict';

    var controllerId = 'userController';
    angular.module('main')
        .controller(controllerId, ['userService', 'logger', userController]);

    function userController(userService, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.email = 'Alice13';
        vm.password = 'password123';
        vm.login = login;
        vm.getToken = getToken;

        initialize();

        function initialize() {
            // 
        };

        function login() {
            userService.login(vm.email, vm.password)
                .success(function () {
                    window.location.href = '/';
                });
        }

        function getToken() {
            userService.getToken(vm.email, vm.password)
                .success(function (result) {
                    logger.logSuccess('result.access_token', result.access_token, true);
                    window.location.href = '/';
                });
        }
    };
})();
