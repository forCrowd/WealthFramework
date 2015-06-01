(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            '$routeParams',
            '$rootScope',
            'logger',
            resourcePoolCustomViewController]);

    function resourcePoolCustomViewController(resourcePoolService, $routeParams, $rootScope, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // ResourcePoolId
        var vm = this;
        vm.resourcePoolId = $routeParams.Id;

        // Title
        resourcePoolService.getResourcePoolExpanded(vm.resourcePoolId)
            .then(function (resourcePoolSet) {
                if (resourcePoolSet.length === 0) {
                    return;
                }

                $rootScope.viewTitle = resourcePoolSet[0].Name;
            });
    };
})();
