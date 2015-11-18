(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            '$routeParams',
            '$rootScope',
            'logger',
            resourcePoolCustomViewController]);

    function resourcePoolCustomViewController(resourcePoolFactory, $routeParams, $rootScope, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // ResourcePoolId
        var vm = this;
        vm.resourcePoolId = $routeParams.Id;

        // Title
        if (vm.resourcePoolId === '0') {
            $rootScope.viewTitle = 'New';
        } else {
            resourcePoolFactory.getResourcePoolExpanded(vm.resourcePoolId)
                .then(function (resourcePool) {

                    if (resourcePool === null) {
                        return;
                    }

                    $rootScope.viewTitle = resourcePool.Name;
                });
        }
    };
})();
