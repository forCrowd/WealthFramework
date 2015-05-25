
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'userService', 'dataContext', '$rootScope', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, userService, dataContext, $rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        var userLoggedIn = false;
        var fetched = [];

        // Service methods
        $delegate.getResourcePoolExpanded = getResourcePoolExpanded;
        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellIndexRating = updateElementCellIndexRating;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        // User logged out
        $rootScope.$on('userLoggedIn', function () {
            fetched = [];
        });
        $rootScope.$on('userLoggedOut', function () {
            fetched = [];
        });

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolExpanded(resourcePoolId) {

            return userService.getUserInfo()
                .then(function (userInfo) {

                    // Prepare the query
                    var query = null;

                    // Is authorized, no, then get only the public data, yes, then get include user's own records
                    if (userInfo === null) {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('ElementSet.ElementFieldSet.ElementFieldIndexSet, ElementSet.ElementItemSet.ElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    } else {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('UserResourcePoolSet, ElementSet.ElementFieldSet.ElementFieldIndexSet.UserElementFieldIndexSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    }

                    // Fetch the data from server, in case if it's not fetched earlier or forced
                    var fetchFromServer = true;
                    for (var i = 0; i < fetched.length; i++) {
                        if (resourcePoolId === fetched[i]) {
                            fetchFromServer = false;
                            break;
                        }
                    }

                    // Prepare the query
                    if (fetchFromServer) { // From remote
                        query = query.using(breeze.FetchStrategy.FromServer)
                    }
                    else { // From local
                        query = query.using(breeze.FetchStrategy.FromLocalCache)
                    }

                    return dataContext.executeQuery(query)
                        .then(success)
                        .catch(failed);

                    function success(response) {

                        // Add the record into fetched list
                        fetched.push(resourcePoolId);

                        var count = response.results.length;
                        //logger.logSuccess('Got ' + count + ' resourcePool(s)', response, true);

                        return response.results;
                    }

                    function failed(error) {
                        var message = error.message || 'ResourcePool query failed';
                        logger.logError(message, error);
                    }
                });
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

                switch (updateType) {
                    case 'increase': {

                        // If there is no item, create it
                        if (userElementCell === null) {
                            userElementCell = {
                                ElementCellId: element.ElementItemSet[itemIndex].multiplierCell().Id,
                                DecimalValue: 2
                            };

                            dataContext.createEntity('UserElementCell', userElementCell);
                        } else { // Else, increase
                            userElementCell.DecimalValue++;
                        }

                        updated = true;
                        break;
                    }
                    case 'decrease': {

                        // If there is no item, create it
                        if (userElementCell === null) {
                            userElementCell = {
                                ElementCellId: element.ElementItemSet[itemIndex].multiplierCell().Id,
                                DecimalValue: 0
                            };

                            dataContext.createEntity('UserElementCell', userElementCell);
                            updated = true;
                        } else { // Else, decrease only if it's bigger than 0
                            if (userElementCell.DecimalValue > 0) {
                                userElementCell.DecimalValue--;
                                updated = true;
                            }
                        }

                        break;
                    }
                    case 'reset': {

                        // If there is an item, delete it
                        if (userElementCell !== null) {
                            userElementCell.entityAspect.setDeleted();
                            updated = true;
                        }

                        break;
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

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementCell === null) {
                        userElementCell = {
                            ElementCellId: elementCell.Id,
                            DecimalValue: 55
                        };

                        dataContext.createEntity('UserElementCell', userElementCell);
                        updated = true;

                    } else { // Else, increase

                        if (userElementCell.DecimalValue < 100) {
                            userElementCell.DecimalValue = userElementCell.DecimalValue + 5 > 100 ? 100 : userElementCell.DecimalValue + 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create it
                    if (userElementCell === null) {
                        userElementCell = {
                            ElementCellId: elementCell.Id,
                            DecimalValue: 45
                        };

                        dataContext.createEntity('UserElementCell', userElementCell);
                        updated = true;

                    } else { // Else, decrease

                        if (userElementCell.DecimalValue > 0) {
                            userElementCell.DecimalValue = userElementCell.DecimalValue - 5 < 0 ? 0 : userElementCell.DecimalValue - 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementCell !== null) {
                        userElementCell.entityAspect.setDeleted();
                        updated = true;
                    }

                    break;
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

            var userElementFieldIndex = elementFieldIndex.userElementFieldIndex();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementFieldIndex === null) {
                        userElementFieldIndex = {
                            ElementFieldIndexId: elementFieldIndex.Id,
                            Rating: 55
                        };

                        dataContext.createEntity('UserElementFieldIndex', userElementFieldIndex);
                        updated = true;

                    } else { // Else, increase

                        if (userElementFieldIndex.Rating < 100) {
                            userElementFieldIndex.Rating = userElementFieldIndex.Rating + 5 > 100 ? 100 : userElementFieldIndex.Rating + 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    if (userElementFieldIndex === null) {
                        userElementFieldIndex = {
                            ElementFieldIndexId: elementFieldIndex.Id,
                            Rating: 45
                        };

                        dataContext.createEntity('UserElementFieldIndex', userElementFieldIndex);
                        updated = true;

                    } else { // Else, increase

                        if (userElementFieldIndex.Rating > 0) {
                            userElementFieldIndex.Rating = userElementFieldIndex.Rating - 5 < 0 ? 0 : userElementFieldIndex.Rating - 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementFieldIndex !== null) {
                        userElementFieldIndex.entityAspect.setDeleted();
                        updated = true;
                    }

                    break;
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

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            ResourcePoolId: resourcePool.Id,
                            ResourcePoolRate: 15
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);
                        updated = true;

                    } else { // Else, increase
                        if (userResourcePool.ResourcePoolRate < 1000) {
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create
                    if (userResourcePool === null) {
                        userResourcePool = {
                            ResourcePoolId: resourcePool.Id,
                            ResourcePoolRate: 5
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);
                        updated = true;

                    } else { // Else, decrease
                        if (userResourcePool.ResourcePoolRate > 0) {
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userResourcePool !== null) {
                        userResourcePool.entityAspect.setDeleted();
                        updated = true;
                    }

                    break;
                }
            }

            // Return
            return updated;

        }
    }
})();
