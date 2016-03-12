(function () {
    'use strict';

    var controllerId = 'FairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', FairShareIndexSampleController]);

    function FairShareIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();
