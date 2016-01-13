(function () {
    'use strict';

    var controllerId = 'indexesPieSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', indexesPieSampleController]);

    function indexesPieSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    };
})();
