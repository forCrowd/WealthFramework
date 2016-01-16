(function () {
    'use strict';

    var controllerId = 'sectorIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', sectorIndexSampleController]);

    function sectorIndexSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    };
})();
