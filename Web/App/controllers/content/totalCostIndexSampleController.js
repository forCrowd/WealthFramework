(function () {
    'use strict';

    var controllerId = 'totalCostIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', totalCostIndexSampleController]);

    function totalCostIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.totalCostIndex_ExistingSystemSampleResourcePoolId = 7;
        vm.totalCostIndex_NewSystemSampleResourcePoolId = 8;
        vm.totalCostIndex_NewSystemAftermathSampleResourcePoolId = 9;
    };
})();
