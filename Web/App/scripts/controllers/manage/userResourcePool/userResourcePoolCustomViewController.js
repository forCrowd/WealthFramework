(function () {
    'use strict';

    var controllerId = 'userResourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['userService',
            'resourcePoolService',
            'userResourcePoolService',
            'mainService',
            '$location',
            '$routeParams',
            'logger',
            userResourcePoolCustomViewController]);

    function userResourcePoolCustomViewController(userService, resourcePoolService, userResourcePoolService, mainService, $location, $routeParams, logger) {
        logger = logger.forSource(controllerId);

        var userResourcePoolId = $routeParams.Id;

        var vm = this;
        vm.userResourcePool = null;

        vm.decreaseMultiplier = decreaseMultiplier;
        vm.increaseMultiplier = increaseMultiplier;
        vm.resetMultiplier = resetMultiplier;

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

        function decreaseMultiplier() {
            resourcePoolService.decreaseMultiplier(userResourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function increaseMultiplier() {
            resourcePoolService.increaseMultiplier(userResourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function resetMultiplier() {
            resourcePoolService.resetMultiplier(userResourcePoolId)
                .success(function () {
                    getUserResourcePool();
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
