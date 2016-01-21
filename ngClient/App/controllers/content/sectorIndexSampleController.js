(function () {
    'use strict';

    var controllerId = 'SectorIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', SectorIndexSampleController]);

    function SectorIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();
