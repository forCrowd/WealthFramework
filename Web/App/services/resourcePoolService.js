
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

            return userService.getCurrentUser()
                .then(function (currentUser) {

                    // Prepare the query
                    var query = null;

                    // Is authorized? No, then get only the public data, yes, then get include user's own records
                    if (currentUser.Id > 0) {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('UserResourcePoolSet, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    } else {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet')
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

                        // Set otherUsers' properties
                        
                        // ResourcePool
                        var resourcePool = response.results[0];
                        resourcePool.setOtherUsersResourcePoolRateTotal();
                        resourcePool.setOtherUsersResourcePoolRateCount();

                        // Elements
                        if (typeof resourcePool.ElementSet !== 'undefined') {
                            for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                                var element = resourcePool.ElementSet[elementIndex];

                                // Fields
                                if (typeof element.ElementFieldSet !== 'undefined') {
                                    for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {
                                        var field = element.ElementFieldSet[fieldIndex];
                                        field.setOtherUsersIndexRatingTotal();
                                        field.setOtherUsersIndexRatingCount();

                                        // Cells
                                        if (typeof field.ElementCellSet !== 'undefined') {
                                            for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {
                                                var cell = field.ElementCellSet[cellIndex];
                                                cell.setOtherUsersNumericValueTotal();
                                                cell.setOtherUsersNumericValueCount();
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        return response.results;
                    }

                    function failed(error) {
                        var message = error.message || 'ResourcePool query failed';
                        logger.logError(message, error, true);
                    }
                });
        }
    }
})();
