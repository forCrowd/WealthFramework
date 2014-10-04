(function () {
    'use strict';

    var controllerId = 'userResourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['userService',
            'userResourcePoolService',
            'mainService',
            '$location',
            '$routeParams',
            'logger',
            userResourcePoolCustomViewController]);

    function userResourcePoolCustomViewController(userService, userResourcePoolService, mainService, $location, $routeParams, logger) {
        logger = logger.forSource(controllerId);

        var userResourcePoolId = $routeParams.Id;

        var vm = this;
        vm.userResourcePool = null;
        vm.decreaseNumberOfSales = decreaseNumberOfSales;
        vm.increaseNumberOfSales = increaseNumberOfSales;
        vm.resetNumberOfSales = resetNumberOfSales;

        initialize();

        function initialize() {
            getUserResourcePool();
        };

        function getUserResourcePool() {

            userResourcePoolService.getUserResourcePool(userResourcePoolId)
                .success(function (userResourcePool) {
                    vm.userResourcePool = userResourcePool;
                });
        }

        function decreaseNumberOfSales() {
            userResourcePoolService.decreaseNumberOfSales(userResourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function increaseNumberOfSales() {
            userResourcePoolService.increaseNumberOfSales(userResourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function resetNumberOfSales() {
            userResourcePoolService.resetNumberOfSales(userResourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }
    };
})();
