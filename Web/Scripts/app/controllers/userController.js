(function () {
    'use strict';

    var controllerId = 'userController';
    angular.module('main')
        .controller(controllerId, ['userService', 'logger', userController]);

    function userController(userService, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        //vm.email = 'serkanholat@hotmail.com';
        //vm.password = '1';
        vm.login = login;

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
    };
})();
