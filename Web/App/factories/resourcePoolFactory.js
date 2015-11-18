
(function () {
    'use strict';

    var factoryId = 'resourcePoolFactory';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(factoryId, [
                '$delegate',
                'ResourcePool',
                'Element',
                'userFactory',
                'dataContext',
                '$rootScope',
                'logger',
                resourcePoolFactory]);
        });

    function resourcePoolFactory(
        $delegate,
        ResourcePool,
        Element,
        userFactory,
        dataContext,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var userLoggedIn = false;
        var fetched = [];

        // Factory methods
        $delegate.createElement = createElement;
        $delegate.createElementField = createElementField;
        $delegate.createElementItem = createElementItem;
        $delegate.createResourcePoolBasic = createResourcePoolBasic;
        $delegate.createResourcePoolTwoElements = createResourcePoolTwoElements;
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

        function createElement(element) {
            return dataContext.createEntity('Element', element);
        }

        function createElementCell(elementCell) {

            var elementCell = dataContext.createEntity('ElementCell', elementCell);

            // User element cell
            if (elementCell.ElementField.ElementFieldType !== 6) {
                var userElementCell = dataContext.createEntity('UserElementCell', {
                    User: elementCell.ElementField.Element.ResourcePool.User,
                    ElementCell: elementCell
                });

                switch (elementCell.ElementField.ElementFieldType) {
                    case 1: {
                        userElementCell.StringValue = '';

                        // Special name field
                        if (elementCell.ElementField.Name === 'Name') {
                            userElementCell.StringValue = elementCell.ElementItem.Name;
                        }

                        break;
                    }
                    case 2: { userElementCell.BooleanValue = false; break; }
                    case 3: { userElementCell.IntegerValue = 0; break; }
                    case 4: { userElementCell.DecimalValue = 50; break; }
                        // TODO 5 (DateTime?)
                    case 11: { userElementCell.DecimalValue = 100; break; }
                    case 12: { userElementCell.DecimalValue = 0; break; }
                }
            }

            return elementCell;
        }

        function createElementField(elementField) {

            elementField = dataContext.createEntity('ElementField', elementField);

            // Related cells
            for (var i = 0; i < elementField.Element.ElementItemSet.length; i++) {
                var elementItem = elementField.Element.ElementItemSet[i];
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            }

            return elementField;
        }

        function createElementItem(elementItem) {

            elementItem = dataContext.createEntity('ElementItem', elementItem);

            // Related cells
            for (var i = 0; i < elementItem.Element.ElementFieldSet.length; i++) {
                var elementField = elementItem.Element.ElementFieldSet[i];
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            }

            return elementItem;
        }

        function createResourcePoolBasic() {

            return userFactory.getCurrentUser()
                .then(function (currentUser) {

                    var resourcePool = dataContext.createEntity('ResourcePool', {
                        User: currentUser,
                        Name: 'New CMRP',
                        InitialValue: 0,
                        UseFixedResourcePoolRate: false
                    });

                    dataContext.createEntity('UserResourcePool', {
                        User: currentUser,
                        ResourcePool: resourcePool,
                        ResourcePoolRate: 10
                    });

                    var element = dataContext.createEntity('Element', {
                        ResourcePool: resourcePool,
                        Name: 'New element'
                    });

                    // Name field
                    var nameField = createElementField({
                        Element: element,
                        Name: 'Name',
                        ElementFieldType: 1,
                        UseFixedValue: true,
                        SortOrder: 1
                    });

                    // Importance field (index)
                    var importanceField = createElementField({
                        Element: element,
                        Name: 'Importance',
                        ElementFieldType: 4,
                        UseFixedValue: false,
                        IndexEnabled: true,
                        IndexType: 2,
                        IndexRatingSortType: 2,
                        SortOrder: 2
                    });

                    // Item 1
                    var item1 = createElementItem({
                        Element: element,
                        Name: 'New item 1' // ?
                    });

                    // Item 2
                    var item2 = createElementItem({
                        Element: element,
                        Name: 'New item 2' // ?
                    });

                    return resourcePool;
                });
        }

        function createResourcePoolTwoElements() {

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Resource pool
                    resourcePool.InitialValue = 100;

                    // Element 2 & items
                    var element2 = resourcePool.ElementSet[0];
                    element2.Name = 'Child';

                    var element2Item1 = element2.ElementItemSet[0];
                    var element2Item2 = element2.ElementItemSet[1];

                    // Element 1
                    var element1 = dataContext.createEntity('Element', {
                        ResourcePool: resourcePool,
                        Name: 'Parent'
                    });

                    // Switch places of the elements
                    // Otherwise 'Child' becomes the main and viewer shows that one first
                    resourcePool.ElementSet[0] = element1;
                    resourcePool.ElementSet[1] = element2;

                    // Name field
                    var nameField = createElementField({
                        Element: element1,
                        Name: 'Name',
                        ElementFieldType: 1,
                        UseFixedValue: true,
                        SortOrder: 1
                    });

                    // Child field (second element)
                    var childField = createElementField({
                        Element: element1,
                        Name: 'Child',
                        ElementFieldType: 6,
                        SelectedElement: element2,
                        UseFixedValue: true,
                        SortOrder: 2
                    });

                    // Item 1
                    var item1 = createElementItem({
                        Element: element1,
                        Name: 'Parent 1' // ?
                    });

                    // Item 1 Cell
                    item1.ElementCell[1].SelectedElementItem = element2Item1;

                    // Item 2
                    var item2 = createElementItem({
                        Element: element1,
                        Name: 'Parent 2' // ?
                    });

                    // Item 2 Cell
                    item2.ElementCell[1].SelectedElementItem = element2Item2;

                    return resourcePool;
                });
        }

        function getNewResourcePoolCreateEntityAsync() {

            return userFactory.getCurrentUser()
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

            return userFactory.getCurrentUser()
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
