(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            '$location',
            '$routeParams',
            '$rootScope',
            'logger',
            resourcePoolCustomViewController]);

    function resourcePoolCustomViewController(resourcePoolFactory, $location, $routeParams, $rootScope, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var action = $location.path().substring($location.path().lastIndexOf('/') + 1);

        var vm = this;
        vm.config = {
            isNew: action === 'new',
            isEdit: action === 'edit',
            resourcePoolId: action === 'new' ? 0 : $routeParams.Id
        };

        // Title
        if (!vm.config.isNew) {
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
