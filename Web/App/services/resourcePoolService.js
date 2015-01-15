
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', '$rootScope', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, $http, $rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getResourcePool = getResourcePool;
        $delegate.decreaseMultiplier = decreaseMultiplier;
        $delegate.increaseMultiplier = increaseMultiplier;
        $delegate.resetMultiplier = resetMultiplier;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        return $delegate;

        /*** Implementations ***/

        function getResourcePool(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/GetResourcePool/' + resourcePoolId;
            return $http.get(url);
        }

        function decreaseMultiplier(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/DecreaseMultiplier/' + resourcePoolId;
            return $http.post(url)
                .success(function () {
                    // Raise resource pool updated event
                    $rootScope.$broadcast('resourcePoolUpdated', resourcePoolId);
                });
        }

        function increaseMultiplier(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/IncreaseMultiplier/' + resourcePoolId;
            return $http.post(url)
                .success(function () {
                    // Raise resource pool updated event
                    $rootScope.$broadcast('resourcePoolUpdated', resourcePoolId);
                });
        }

        function resetMultiplier(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/ResetMultiplier/' + resourcePoolId;
            return $http.post(url)
                .success(function () {
                    // Raise resource pool updated event
                    $rootScope.$broadcast('resourcePoolUpdated', resourcePoolId);
                });
        }

        function updateResourcePoolRate(resourcePoolId, resourcePoolRate) {
            var url = '/api/ResourcePoolCustom/UpdateResourcePoolRate/' + resourcePoolId;
            return $http.post(url, resourcePoolRate)
                .success(function () {
                    // Raise resource pool updated event
                    $rootScope.$broadcast('resourcePoolUpdated', resourcePoolId);
                });
        }
    }
})();
