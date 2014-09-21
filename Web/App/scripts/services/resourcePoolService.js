
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, $http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getResourcePoolViewModel = getResourcePoolViewModel;

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolViewModel(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/ResourcePoolViewModel/' + resourcePoolId;
            return $http.get(url);
        }
    }
})();
