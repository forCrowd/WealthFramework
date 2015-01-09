(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            '$routeParams',
            'logger',
            resourcePoolCustomViewController]);

    function resourcePoolCustomViewController(resourcePoolService, $routeParams, logger) {
        logger = logger.forSource(controllerId);

        var resourcePoolId = $routeParams.Id;

        var vm = this;
        vm.resourcePool = null;
        vm.decreaseMultiplier = decreaseMultiplier;
        vm.increaseMultiplier = increaseMultiplier;
        vm.resetMultiplier = resetMultiplier;
        vm.decreaseResourcePoolRate = decreaseResourcePoolRate;
        vm.increaseResourcePoolRate = increaseResourcePoolRate;
        vm.resetResourcePoolRate = resetResourcePoolRate;

        initialize();

        function initialize() {
            getResourcePool();
        };

        function getResourcePool() {
            resourcePoolService.getResourcePool(resourcePoolId)
                .success(function (resourcePool) {
                    vm.resourcePool = resourcePool;
                });
        }

        function decreaseMultiplier() {
            resourcePoolService.decreaseMultiplier(resourcePoolId)
                .success(function () {
                    getResourcePool();
                });
        }

        function increaseMultiplier() {
            resourcePoolService.increaseMultiplier(resourcePoolId)
                .success(function () {
                    getResourcePool();
                });
        }

        function resetMultiplier() {
            resourcePoolService.resetMultiplier(resourcePoolId)
                .success(function () {
                    getResourcePool();
                });
        }

        function decreaseResourcePoolRate() {
            resourcePoolService.updateResourcePoolRate(resourcePoolId, vm.resourcePool.ResourcePoolRate - 5)
                .success(function () {
                    getResourcePool();
                });
        }

        function increaseResourcePoolRate() {
            resourcePoolService.updateResourcePoolRate(resourcePoolId, vm.resourcePool.ResourcePoolRate + 5)
                .success(function () {
                    getResourcePool();
                });
        }

        function resetResourcePoolRate() {
            resourcePoolService.updateResourcePoolRate(resourcePoolId, 0)
                .success(function () {
                    getResourcePool();
                });
        }
    };
})();
