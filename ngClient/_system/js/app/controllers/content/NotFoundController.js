(function () {
    'use strict';

    var controllerId = 'NotFoundController';
    angular.module('main')
        .controller(controllerId, ['logger', '$location', NotFoundController]);

    function NotFoundController(logger, $location) {

        // Logger
        logger = logger.forSource(controllerId);

        _init();

        /*** Implementations ***/

        function _init() {
            var url = $location.search().url;
            if (typeof url !== 'undefined') {
                throw new Error('Not found: ' + url);
            }
        }
    }
})();
