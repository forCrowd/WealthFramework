(function () {
    'use strict';

    var controllerId = 'FairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userFactory', 'logger', FairShareIndexSampleController]);

    function FairShareIndexSampleController(userFactory, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();
