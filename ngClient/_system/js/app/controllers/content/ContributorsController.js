(function () {
    'use strict';

    var controllerId = 'ContributorsController';
    angular.module('main')
        .controller(controllerId, ['logger', ContributorsController]);

    function ContributorsController(logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getDate = getDate;
        
        function getDate(day, month, year) {
            return new Date(year, month - 1, day);
        }
    }
})();
