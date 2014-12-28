
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, $http, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getUserResourcePool = getUserResourcePool;
        $delegate.decreaseMultiplier = decreaseMultiplier;
        $delegate.increaseMultiplier = increaseMultiplier;
        $delegate.resetMultiplier = resetMultiplier;

        return $delegate;

        /*** Implementations ***/

        function getUserResourcePool(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/GetResourcePool/' + resourcePoolId;
            return $http.get(url);
        }

        function decreaseMultiplier(userResourcePoolId) {
            var url = '/api/ResourcePoolCustom/DecreaseMultiplier/' + userResourcePoolId;
            return $http.post(url);
        }

        function increaseMultiplier(userResourcePoolId) {
            var url = '/api/ResourcePoolCustom/IncreaseMultiplier/' + userResourcePoolId;
            return $http.post(url);
        }

        function resetMultiplier(userResourcePoolId) {
            var url = '/api/ResourcePoolCustom/ResetMultiplier/' + userResourcePoolId;
            return $http.post(url);
        }
    }
})();
