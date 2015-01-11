(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomViewController';
    angular.module('main')
        .controller(controllerId, ['$routeParams',
            'logger',
            resourcePoolCustomViewController]);

    function resourcePoolCustomViewController($routeParams, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolId = $routeParams.Id;
    };
})();
