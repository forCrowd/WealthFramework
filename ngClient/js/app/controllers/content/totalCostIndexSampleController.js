(function () {
    'use strict';

    var controllerId = 'TotalCostIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', TotalCostIndexSampleController]);

    function TotalCostIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();
