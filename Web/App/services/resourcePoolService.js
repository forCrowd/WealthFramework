
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
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        // Overwrites the base resourcePoolService.saveChanges() function
        $delegate.saveChanges = saveChanges;

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolCustom(resourcePoolId, valueFilter) {
            var url = '/api/ResourcePoolCustom/GetResourcePool/' + resourcePoolId;

            if (typeof valueFilter !== 'undefined')
                url += '/' + valueFilter;

            return $http.get(url);
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
