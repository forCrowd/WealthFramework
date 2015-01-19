
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', '$rootScope', 'dataContext', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, $http, $rootScope, dataContext, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getResourcePoolCustom = getResourcePoolCustom;
        $delegate.decreaseMultiplier = decreaseMultiplier;
        $delegate.increaseMultiplier = increaseMultiplier;
        $delegate.resetMultiplier = resetMultiplier;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        // Overwrites the base resourcePoolService.saveChanges() function
        $delegate.saveChanges = saveChanges;

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolCustom(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/GetResourcePool/' + resourcePoolId;
            return $http.get(url);
        }

        function decreaseMultiplier(resourcePoolId, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ResourcePoolCustom/DecreaseMultiplier/' + resourcePoolId;
            return $http.post(url)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('resourcePool_MultiplierDecreased', resourcePoolId, eventSource);
                });
        }

        function increaseMultiplier(resourcePoolId, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ResourcePoolCustom/IncreaseMultiplier/' + resourcePoolId;
            return $http.post(url)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('resourcePool_MultiplierIncreased', resourcePoolId, eventSource);
                });
        }

        function resetMultiplier(resourcePoolId, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ResourcePoolCustom/ResetMultiplier/' + resourcePoolId;
            return $http.post(url)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('resourcePool_MultiplierReset', resourcePoolId, eventSource);
                });
        }

        function updateResourcePoolRate(resourcePoolId, resourcePoolRate, eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            var url = '/api/ResourcePoolCustom/UpdateResourcePoolRate/' + resourcePoolId;
            return $http.post(url, resourcePoolRate)
                .success(function () {
                    // Raise the event
                    $rootScope.$broadcast('resourcePool_ResourcePoolRateUpdated', resourcePoolId, eventSource);
                });
        }

        function saveChanges(eventSource) {
            if (typeof eventSource === 'undefined') { eventSource = ''; }
            return dataContext.saveChanges()
                .then(function (result) {
                    for (var i = 0; i < result.entities.length; i++) {
                        var entity = result.entities[i];
                        if (entity.entityAspect._entityKey.entityType.shortName === 'ResourcePool') {
                            // Raise the event
                            $rootScope.$broadcast('resourcePool_Saved', entity._backingStore.Id, eventSource);
                        }
                    }

                    // Return
                    return result;
                });
        }
    }
})();
