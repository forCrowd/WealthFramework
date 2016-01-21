(function () {
    'use strict';

    var controllerId = 'ResourcePoolRateSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', ResourcePoolRateSampleController]);

    function ResourcePoolRateSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolRate_SampleResourcePoolId = 12;
    }
})();
