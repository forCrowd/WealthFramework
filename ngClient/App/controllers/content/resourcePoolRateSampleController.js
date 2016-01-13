(function () {
    'use strict';

    var controllerId = 'resourcePoolRateSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', resourcePoolRateSampleController]);

    function resourcePoolRateSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolRate_SampleResourcePoolId = 12;
    };
})();
