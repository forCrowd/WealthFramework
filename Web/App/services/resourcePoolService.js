
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
        $delegate.getResourcePoolCustomEdit = getResourcePoolCustomEdit;
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

        function getResourcePoolCustomEdit(resourcePoolId) {
            //function getResourcePoolCustomEdit(resourcePoolId, valueFilter) {
            //function getResourcePool(resourcePoolId, forceRefresh) {

            var query = breeze.EntityQuery
                .from('Element')
                //.expand('ElementSet')
                .expand('ResourcePool, ElementFieldSet.ElementFieldIndexSet, ElementItemSet.ElementCellSet')
                .where('ResourcePoolId', 'eq', resourcePoolId)
                //.orderBy('ElementFieldSet.SortOrder')
            ;

            query = query.using(breeze.FetchStrategy.FromServer);

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                var count = response.results.length;
                logger.logSuccess('Got ' + count + ' resourcePool(s)', response, true);
                return response.results;
            }

            function failed(error) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error, true);
            }

            //return dataContext.fetchEntityByKey('ResourcePool', resourcePoolId, !forceRefresh)
            //    .then(success).catch(failed);

            //function success(result) {
            //    return result.entity;
            //}

            //function failed(error) {
            //    var message = error.message || 'getResourcePool query failed';
            //    logger.logError(message, error, true);
            //}
            // }
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
