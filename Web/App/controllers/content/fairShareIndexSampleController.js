(function () {
    'use strict';

    var controllerId = 'fairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userFactory', 'logger', fairShareIndexSampleController]);

    function fairShareIndexSampleController(userFactory, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.fairShareIndex_SampleResourcePoolId = 10;
    };
})();
