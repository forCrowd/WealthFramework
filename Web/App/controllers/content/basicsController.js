(function () {
    'use strict';

    var controllerId = 'basicsController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', 'logger', basicsController]);

    function basicsController(resourcePoolFactory, userFactory, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.existingModelConfig = { resourcePoolId: 2 };
        vm.newModelConfig = { resourcePoolId: 3 };

        // Listen resource pool updated event
        $scope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        function updateOppositeResourcePool(event, element) {

            if (element.ResourcePool.Id === vm.existingModelConfig.resourcePoolId
                || element.ResourcePool.Id === vm.newModelConfig.resourcePoolId) {

                var oppositeResourcePoolId = element.ResourcePool.Id === vm.existingModelConfig.resourcePoolId
                    ? vm.newModelConfig.resourcePoolId
                    : vm.existingModelConfig.resourcePoolId;

                // Call the service to increase the multiplier
                resourcePoolFactory.getResourcePoolExpanded(oppositeResourcePoolId)
                    .then(function (resourcePool) {

                        if (resourcePool === null) {
                            return;
                        }

                        var result = false;
                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': { userFactory.updateElementMultiplier(resourcePool.mainElement(), 'increase'); break; }
                            case 'resourcePoolEditor_elementMultiplierDecreased': { userFactory.updateElementMultiplier(resourcePool.mainElement(), 'decrease'); break; }
                            case 'resourcePoolEditor_elementMultiplierReset': { userFactory.updateElementMultiplier(resourcePool.mainElement(), 'reset'); break; }
                        }

                        // Save changes, if there is a registered user
                        userFactory.isAuthenticated()
                            .then(function (isAuthenticated) {
                                if (isAuthenticated) {
                                    resourcePoolFactory.saveChanges(1500);
                                }
                            });
                    });
            }
        }
    };
})();
