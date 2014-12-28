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

        initialize();

        function initialize() {
            getUserResourcePool();
        };

        function getUserResourcePool() {

            resourcePoolService.getUserResourcePool(resourcePoolId)
                .success(function (resourcePool) {
                    vm.resourcePool = resourcePool;
                });
        }

        function decreaseMultiplier() {
            resourcePoolService.decreaseMultiplier(resourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function increaseMultiplier() {
            resourcePoolService.increaseMultiplier(resourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function resetMultiplier() {
            resourcePoolService.resetMultiplier(resourcePoolId)
                .success(function () {
                    getUserResourcePool();
                });
        }
    };
})();
