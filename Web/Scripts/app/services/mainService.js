
(function () {
    'use strict';

    var serviceId = 'mainService';
    angular.module('main')
        .factory(serviceId, ['$http', 'logger', mainService]);

    function mainService($http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods (alphabetically)
        var service = {
            getCurrentVersion: getCurrentVersion
        };

        return service;

        /*** Implementations ***/

        function getCurrentVersion()
        {
            var url = '/api/Application/CurrentVersion';

            return $http({
                method: 'GET',
                url: url
            }).
                //success(function () {
                //}).
                error(function () {
                    // TODO
                });
        }
    }

})();
