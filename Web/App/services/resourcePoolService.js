
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, dataContext, logger) {

        // Logger
        logger = logger.forSource(serviceId);
        var fetchedResourcePools = [];

        // Service methods
        $delegate.getResourcePoolExpanded = getResourcePoolExpanded;
        $delegate.getResourcePoolExpandedWithUser = getResourcePoolExpandedWithUser;
        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellIndexRating = updateElementCellIndexRating;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolExpanded(resourcePoolId) {

            var query = breeze.EntityQuery
                .from('ResourcePool')
                .expand('ElementSet.ElementFieldSet.ElementFieldIndexSet, ElementSet.ElementItemSet.ElementCellSet')
                .where('Id', 'eq', resourcePoolId);

            return getResourcePoolExpandedInternal(resourcePoolId, query);
        }

        function getResourcePoolExpandedWithUser(resourcePoolId) {

            var query = breeze.EntityQuery
                .from('ResourcePool')
                .expand('UserResourcePoolSet, ElementSet.ElementFieldSet.ElementFieldIndexSet.UserElementFieldIndexSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet')
                .where('Id', 'eq', resourcePoolId);

            return getResourcePoolExpandedInternal(resourcePoolId, query);
        }

        function getResourcePoolExpandedInternal(resourcePoolId, query) {

            // Fetch the data from server, in case if it's not fetched earlier or forced
            var fetchFromServer = true;

            for (var i = 0; i < fetchedResourcePools.length; i++) {
                if (resourcePoolId === fetchedResourcePools[i]) {
                    fetchFromServer = false;
                    break;
                }
            }

            // Prepare the query
            if (fetchFromServer) { // From remote
                query = query.using(breeze.FetchStrategy.FromServer)
                fetchedResourcePools.push(resourcePoolId);
            }
            else { // From local
                query = query.using(breeze.FetchStrategy.FromLocalCache)
            }

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                var count = response.results.length;
                //logger.logSuccess('Got ' + count + ' resourcePool(s)', response, true);
                return response.results;
            }

            function failed(error) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error);
            }

        }

        // This function was in element.js as it should be. Only because it had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle this case by using broadcast later on.
        function updateElementMultiplier(element, updateType) {

            // Validate
            if (element.multiplierField() === null || typeof element.ElementItemSet === 'undefined')
                return false;

            // Determines whether there is an update
            var updated = false;

            // Find user element cell
            for (var itemIndex = 0; itemIndex < element.ElementItemSet.length; itemIndex++) {

                var userElementCell = element.ElementItemSet[itemIndex].multiplierCell().userElementCell('x'); // x is only for test

                // If there is not, create a new one
                if (userElementCell === null) {

                    userElementCell = {
                        ElementCellId: element.ElementItemSet[itemIndex].multiplierCell().Id,
                        DecimalValue: updateType === 'increase' ? 1 : 0
                    };

                    dataContext.createEntity('UserElementCell', userElementCell);

                    updated = true;
                } else {
                    if (updateType === 'increase'
                        || ((updateType === 'decrease'
                        || updateType === 'reset')
                        && userElementCell.DecimalValue > 0)) {

                        userElementCell.DecimalValue = updateType === 'increase'
                        ? userElementCell.DecimalValue + 1
                        : updateType === 'decrease'
                        ? userElementCell.DecimalValue - 1
                        : 0;

                        updated = true;
                    }
                }
            }

            // Return
            return updated;
        }

        // This function was in elementCell.js as it should be. Only because it had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle this case by using broadcast later on.
        function updateElementCellIndexRating(elementCell, updateType) {

            // Determines whether there is an update
            var updated = false;

            // Validate
            if (elementCell.ElementField.ElementFieldIndexSet.length === 0)
                return updated;

            var userElementCell = elementCell.userElementCell();

            if (userElementCell === null) {

                userElementCell = {
                    ElementCellId: elementCell.Id,
                    DecimalValue: updateType === 'increase' ? 55 : 45
                };

                dataContext.createEntity('UserElementCell', userElementCell);

                updated = true;
            } else {

                var value = 0;

                if (userElementCell.DecimalValue !== null) {
                    value = userElementCell.DecimalValue;
                } else {
                    // TODO?
                }

                if (updateType === 'increase' && value < 100) {

                    value = value + 5 >= 100 ? 100 : value + 5;
                    updated = true;
                } else if (updateType === 'decrease' && value > 0) {

                    value = value - 5 <= 0 ? 0 : value - 5;
                    updated = true;
                }

                if (updated) {
                    userElementCell.DecimalValue = value;
                }
            }

            // Return
            return updated;
        }

        // This function was in elementFieldIndex.js as it should be. Only because it had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle this case by using broadcast later on.
        function updateElementFieldIndexRating(elementFieldIndex, updateType) {

            // Determines whether there is an update
            var updated = false;

            //// Validate
            //if (elementFieldIndex.ElementField.ElementFieldIndexSet.length === 0)
            //    return updated;

            var userElementFieldIndex = elementFieldIndex.userElementFieldIndex();

            if (userElementFieldIndex === null) {

                userElementFieldIndex = {
                    ElementFieldIndexId: elementFieldIndex.Id,
                    Rating: updateType === 'increase' ? 55 : 45
                };

                dataContext.createEntity('UserElementFieldIndex', userElementFieldIndex);

                updated = true;
            } else {

                var value = userElementFieldIndex.Rating;

                if (updateType === 'increase' && value < 100) {

                    value = value + 5 >= 100 ? 100 : value + 5;
                    updated = true;
                } else if (updateType === 'decrease' && value > 0) {

                    value = value - 5 <= 0 ? 0 : value - 5;
                    updated = true;
                }

                if (updated) {
                    userElementFieldIndex.Rating = value;
                }
            }

            // Return
            return updated;
        }

        // This function was in resourcePool.js as it should be. Only because it had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle this case by using broadcast later on.
        function updateResourcePoolRate(resourcePool, updateType) {

            // Determines whether there is an update
            var updated = false;

            var userResourcePool = resourcePool.userResourcePool();

            // Validate
            if (userResourcePool === null) {

                userResourcePool = {
                    ResourcePoolId: resourcePool.Id,
                    ResourcePoolRate: updateType === 'increase' ? 15 : 5
                };

                dataContext.createEntity('UserResourcePool', userResourcePool);

                updated = true;
            } else {

                var value = userResourcePool.ResourcePoolRate;

                if (updateType === 'increase' && value < 500) {

                    value = value + 5 >= 500 ? 500 : value + 5;
                    updated = true;
                } else if (updateType === 'decrease' && value > 0) {

                    value = value - 5 <= 0 ? 0 : value - 5;
                    updated = true;
                }

                if (updated) {
                    userResourcePool.ResourcePoolRate = value;
                }
            }

            // Return
            return updated;

        }
    }
})();
