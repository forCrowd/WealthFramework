(function () {
    'use strict';

    var controllerId = 'IndexesPieSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', IndexesPieSampleController]);

    function IndexesPieSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();
