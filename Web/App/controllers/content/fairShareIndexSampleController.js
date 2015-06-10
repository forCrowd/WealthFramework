(function () {
    'use strict';

    var controllerId = 'fairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', 'logger', fairShareIndexSampleController]);

    function fairShareIndexSampleController(userService, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.fairShareIndex_SampleResourcePoolId = 10;
    };
})();
