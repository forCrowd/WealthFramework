(function () {
    'use strict';

    var controllerId = 'PriorityIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', PriorityIndexSampleController]);

    function PriorityIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();
