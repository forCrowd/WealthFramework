(function () {
    'use strict';

    var controllerId = 'closingNotesController';
    angular.module('main')
        .controller(controllerId, ['$location', 'logger', closingNotesController]);

    function closingNotesController($location, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isLocalhost = $location.$$host === 'localhost';
    };
})();
