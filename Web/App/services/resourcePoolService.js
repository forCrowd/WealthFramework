
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, [
                '$delegate',
                'ResourcePool',
                'Element',
                'userService',
                'dataContext',
                '$rootScope',
                'logger',
                resourcePoolService]);
        });

    function resourcePoolService(
        $delegate,
        ResourcePool,
        Element,
        userService,
        dataContext,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(serviceId);

        var userLoggedIn = false;
        var fetched = [];

        // Service methods
        $delegate.getNewResourcePool = getNewResourcePool;
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

        function getNewResourcePool() {

            return userService.getCurrentUser()
                .then(function (currentUser) {

                    var resourcePoolInitial = {};
                    resourcePoolInitial.User = currentUser;
                    resourcePoolInitial.Name = 'New CMRP';
                    resourcePoolInitial.InitialValue = 0;
                    resourcePoolInitial.UseFixedResourcePoolRate = false;

                    var resourcePool = dataContext.createEntity('ResourcePool', resourcePoolInitial);

                    var elementInitial = {};
                    elementInitial.ResourcePool = resourcePool;
                    elementInitial.Name = 'Element';

                    var element = dataContext.createEntity('Element', elementInitial);

                    // Name field
                    var nameFieldInitial = {};
                    nameFieldInitial.Element = element;
                    nameFieldInitial.Name = 'Name';
                    nameFieldInitial.ElementFieldType = 1;
                    nameFieldInitial.UseFixedValue = true;
                    nameFieldInitial.SortOrder = 1;

                    var nameField = dataContext.createEntity('ElementField', nameFieldInitial);

                    // Importance field index
                    var importanceFieldInitial = {};
                    importanceFieldInitial.Element = element;
                    importanceFieldInitial.Name = 'Importance';
                    importanceFieldInitial.ElementFieldType = 4;
                    importanceFieldInitial.UseFixedValue = false;
                    importanceFieldInitial.IndexEnabled = true;
                    importanceFieldInitial.IndexType = 2;
                    importanceFieldInitial.IndexRatingSortType = 2;
                    importanceFieldInitial.SortOrder = 2;

                    var importanceField = dataContext.createEntity('ElementField', importanceFieldInitial);

                    var item1Initial = {};
                    item1Initial.Element = element;
                    item1Initial.Name = 'Item 1'; // ?

                    var item1 = dataContext.createEntity('ElementItem', item1Initial);

                    var cell1Initial = {};
                    cell1Initial.ElementField = nameField;
                    cell1Initial.ElementItem = item1;

                    var cell1 = dataContext.createEntity('ElementCell', cell1Initial);

                    var userCell1Initial = {};
                    userCell1Initial.User = currentUser;
                    userCell1Initial.ElementCell = cell1;
                    userCell1Initial.StringValue = 'Item 1';

                    var userCell1 = dataContext.createEntity('UserElementCell', userCell1Initial);

                    var item1Initial = {};
                    item1Initial.Element = element;
                    item1Initial.Name = 'Item 1'; // ?

                    var cell2Initial = {};
                    cell2Initial.ElementField = importanceField;
                    cell2Initial.ElementItem = item1;

                    var cell2 = dataContext.createEntity('ElementCell', cell2Initial);

                    return resourcePool;

                    //logger.log('cmrp id', cmrp.Id);
                    //logger.log('elm cmrp id', elm.ResourcePool.Id);
                    //logger.log('elm cmrp id 2', elm.ResourcePoolId);

                });

        }

        function getNewResourcePoolCreateEntityAsync() {

            return userService.getCurrentUser()
                .then(function (currentUser) {

                    var resourcePoolInitial = {};
                    resourcePoolInitial.User = currentUser;
                    resourcePoolInitial.Name = 'New CMRP';
                    resourcePoolInitial.InitialValue = 0;
                    resourcePoolInitial.UseFixedResourcePoolRate = false;

                    return dataContext.createEntity('ResourcePool', resourcePoolInitial)
                        .then(function (resourcePool) {

                            var elementInitial = {};
                            elementInitial.ResourcePool = resourcePool;
                            elementInitial.Name = 'Element';

                            return dataContext.createEntity('Element', elementInitial)
                                .then(function (element) {

                                    // Name field
                                    var nameFieldInitial = {};
                                    nameFieldInitial.Element = element;
                                    nameFieldInitial.Name = 'Name';
                                    nameFieldInitial.ElementFieldType = 1;
                                    nameFieldInitial.UseFixedValue = null;
                                    nameFieldInitial.SortOrder = 1;

                                    return dataContext.createEntity('ElementField', nameFieldInitial)
                                        .then(function (nameField) {

                                            var item1Initial = {};
                                            item1Initial.Element = element;
                                            item1Initial.Name = 'Item 1'; // ?

                                            return dataContext.createEntity('ElementItem', item1Initial)
                                                .then(function (item1) {

                                                    var cell1Initial = {};
                                                    cell1Initial.ElementField = nameField;
                                                    cell1Initial.ElementItem = item1;

                                                    return dataContext.createEntity('ElementCell', cell1Initial)
                                                        .then(function (cell1) {

                                                            var userCell1Initial = {};
                                                            userCell1Initial.User = currentUser;
                                                            userCell1Initial.ElementCell = cell1;
                                                            userCell1Initial.StringValue = 'Item 1';

                                                            return dataContext.createEntity('UserElementCell', userCell1Initial)
                                                                .then(function (userCell1) {

                                                                    return resourcePool;
                                                                });
                                                        });
                                                });
                                        });

                                    //logger.log('cmrp id', cmrp.Id);
                                    //logger.log('elm cmrp id', elm.ResourcePool.Id);
                                    //logger.log('elm cmrp id 2', elm.ResourcePoolId);

                                });

                        });

                });

        }

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

                        // If there is no cmrp with this Id, return null
                        if (response.results.length === 0) {
                            return null;
                        }

                        // ResourcePool
                        var resourcePool = response.results[0];

                        // Set otherUsers' properties
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

                        return resourcePool;
                    }

                    function failed(error) {
                        var message = error.message || 'ResourcePool query failed';
                        logger.logError(message, error, true);
                    }
                });
        }
    }
})();
