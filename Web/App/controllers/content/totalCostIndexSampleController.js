(function () {
    'use strict';

    var controllerId = 'totalCostIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', totalCostIndexSampleController]);

    function totalCostIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    };
})();
