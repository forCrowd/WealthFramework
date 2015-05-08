(function () {
    'use strict';

    var controllerId = 'basicsController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userService', '$rootScope', 'logger', basicsController]);

    function basicsController(resourcePoolService, userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.authorized = false;
        vm.basics_ExistingModelResourcePoolId = 2;
        vm.basics_NewModelResourcePoolId = 3;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.authorized = true;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.authorized = false;
        });

        // Listen resource pool updated event
        $rootScope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $rootScope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $rootScope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        function updateOppositeResourcePool(event, element) {

            if (!vm.authorized) {
                return;
            }

            if (element.ResourcePool.Id === vm.basics_ExistingModelResourcePoolId
                || element.ResourcePool.Id === vm.basics_NewModelResourcePoolId) {

                var oppositeResourcePoolId = element.ResourcePool.Id === vm.basics_ExistingModelResourcePoolId
                    ? vm.basics_NewModelResourcePoolId
                    : vm.basics_ExistingModelResourcePoolId;

                // Call the service to increase the multiplier
                resourcePoolService.getResourcePoolExpanded(oppositeResourcePoolId)
                    .then(function (resourcePoolSet) {

                        var resourcePool = resourcePoolSet[0];
                        var mainElement = resourcePool.mainElement();

                        var result = false;
                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': { result = resourcePoolService.updateElementMultiplier(mainElement, 'increase'); break; }
                            case 'resourcePoolEditor_elementMultiplierDecreased': { result = resourcePoolService.updateElementMultiplier(mainElement, 'decrease'); break; }
                            case 'resourcePoolEditor_elementMultiplierReset': { result = resourcePoolService.updateElementMultiplier(mainElement, 'reset'); break; }
                        }

                        if (result)
                            resourcePoolService.saveChanges();
                    });
            }
        }
    };
})();
