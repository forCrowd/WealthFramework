module Main.Factories {
    'use strict';

    var factoryId = 'resourcePoolFactory';

    angular.module('main')
        .factory(factoryId, ['dataContext', 'Element', 'logger', 'ResourcePool', '$rootScope', resourcePoolFactory]);

    function resourcePoolFactory(dataContext: any, Element: any, logger: any, ResourcePool: any, $rootScope: any) {

        // Logger
        logger = logger.forSource(factoryId);

        // Factory methods (alphabetically)
        var factory = {
            copyResourcePool: copyResourcePool,
            createElement: createElement,
            createElementField: createElementField,
            createElementItem: createElementItem,
            createResourcePoolBasic: createResourcePoolBasic,
            createResourcePoolDirectIncomeAndMultiplier: createResourcePoolDirectIncomeAndMultiplier,
            createResourcePoolTwoElements: createResourcePoolTwoElements,
            getResourcePoolExpanded: getResourcePoolExpanded,
            getResourcePoolSet: getResourcePoolSet,
            removeElement: removeElement,
            removeElementField: removeElementField,
            removeElementItem: removeElementItem,
            removeResourcePool: removeResourcePool,
            removeUserElementField: removeUserElementField,
            updateElementMultiplier: updateElementMultiplier,
            updateElementCellMultiplier: updateElementCellMultiplier,
            updateElementCellDecimalValue: updateElementCellDecimalValue,
            updateElementFieldIndexRating: updateElementFieldIndexRating,
            updateResourcePoolRate: updateResourcePoolRate
        };
        var fetchedList = [];
        var fetchFromServer = true;

        // Events
        $rootScope.$on('dataContext_currentUserChanged', () => {
            fetchedList = [];
            fetchFromServer = true;
        });
        $rootScope.$on('ElementField_DataTypeChanged', elementField_DataTypeChanged);
        $rootScope.$on('ElementField_IndexEnabledChanged', elementField_IndexEnabledChanged);

        return factory;

        /*** Implementations ***/

        function copyResourcePool(resourcePoolSource) {
            // TODO
        }

        function createElement(element: any) {
            return dataContext.createEntity('Element', element);
        }

        function createElementCell(elementCellInitial: any) {

            var elementCell = dataContext.createEntity('ElementCell', elementCellInitial);

            // User element cell
            if (elementCell.ElementField.DataType !== 6) {
                createUserElementCell(elementCell, null, false);
            }

            return elementCell;
        }

        function createElementField(elementField: any) {

            elementField = dataContext.createEntity('ElementField', elementField);

            // Related user element field, if IndexEnabled
            if (elementField.IndexEnabled) {
                createUserElementField(elementField);
            }

            // Related cells
            elementField.Element.ElementItemSet.forEach(elementItem => {
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            });

            return elementField;
        }

        function createElementItem(elementItem: any) {

            elementItem = dataContext.createEntity('ElementItem', elementItem);

            // Related cells
            elementItem.Element.ElementFieldSet.forEach(elementField => {
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            });

            return elementItem;
        }

        function createResourcePoolBasic(initializeResourcePool?) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            var currentUser = dataContext.getCurrentUser();
            var resourcePoolRate = 10;

            var resourcePool = dataContext.createEntity('ResourcePool', {
                User: currentUser,
                Name: 'New CMRP',
                Key: 'New-CMRP',
                Description: 'Description for CMRP',
                InitialValue: 100,
                UseFixedResourcePoolRate: true
            });
            
            createUserResourcePool(resourcePool);

            var element = createElement({
                ResourcePool: resourcePool,
                Name: 'New element'
            });
            element.IsMainElement = true;

            // Importance field (index)
            createElementField({
                Element: element,
                Name: 'Importance',
                DataType: 4,
                UseFixedValue: false,
                IndexEnabled: true,
                IndexCalculationType: 2,
                IndexSortType: 1,
                SortOrder: 1
            });

            // Item 1
            createElementItem({
                Element: element,
                Name: 'New item 1'
            });

            // Item 2
            createElementItem({
                Element: element,
                Name: 'New item 2'
            });

            // Initialize
            if (initializeResourcePool) {
                resourcePool._init(true);
            }

            return resourcePool;
        }

        function createResourcePoolDirectIncomeAndMultiplier(initializeResourcePool: any) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            var resourcePool = createResourcePoolBasic();

            // Convert Importance field to Sales Price field
            var salesPriceField = resourcePool.mainElement().ElementFieldSet[0];
            salesPriceField.Name = 'Sales Price';
            salesPriceField.DataType = 11;
            salesPriceField.UseFixedValue = true;
            salesPriceField.IndexEnabled = false;
            salesPriceField.IndexCalculationType = 0;
            salesPriceField.IndexSortType = 0;

            // Number of Sales field
            var numberOfSalesField = createElementField({
                Element: resourcePool.mainElement(),
                Name: 'Number of Sales',
                DataType: 12,
                UseFixedValue: false,
                SortOrder: 2
            });

            if (initializeResourcePool) {
                resourcePool._init(true);
            }

            return resourcePool;
        }

        function createResourcePoolTwoElements(initializeResourcePool: any) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            var resourcePool = createResourcePoolBasic();

            // Element 2 & items
            var element2 = resourcePool.ElementSet[0];
            element2.Name = 'Child';

            var element2Item1 = element2.ElementItemSet[0];
            var element2Item2 = element2.ElementItemSet[1];

            // Element 1
            var element1 = createElement({
                ResourcePool: resourcePool,
                Name: 'Parent'
            });
            element1.IsMainElement = true;

            // Child field (second element)
            createElementField({
                Element: element1,
                Name: 'Child',
                DataType: 6,
                SelectedElement: element2,
                UseFixedValue: true,
                SortOrder: 1
            });

            // Item 1
            var item1 = createElementItem({
                Element: element1,
                Name: 'Parent 1'
            });

            // Item 1 Cell
            item1.ElementCellSet[0].SelectedElementItem = element2Item1;

            // Item 2
            var item2 = createElementItem({
                Element: element1,
                Name: 'Parent 2'
            });

            // Item 2 Cell
            item2.ElementCellSet[0].SelectedElementItem = element2Item2;

            if (initializeResourcePool) {
                resourcePool._init(true);
            }

            return resourcePool;
        }

        function createUserElementCell(elementCell, value, updateCache?) {
            updateCache = typeof updateCache !== 'undefined' ? updateCache : true;

            var currentUser = dataContext.getCurrentUser();

            // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
            var existingKey = [currentUser.Id, elementCell.Id];
            var userElementCell = dataContext.getEntityByKey('UserElementCell', existingKey);

            if (typeof userElementCell !== 'undefined' && userElementCell !== null) {

                // If it's deleted, restore it
                if (userElementCell.entityAspect.entityState.isDeleted()) {
                    userElementCell.entityAspect.rejectChanges();
                }

                switch (elementCell.ElementField.DataType) {
                case 1: { userElementCell.StringValue = value !== null ? value : ''; break; }
                case 2: { userElementCell.BooleanValue = value !== null ? value : false; break; }
                case 3: { userElementCell.IntegerValue = value !== null ? value : 0; break; }
                case 4: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case 6: { break; }
                case 11: { userElementCell.DecimalValue = value !== null ? value : 100; break; }
                case 12: { userElementCell.DecimalValue = value !== null ? value : 0; break; }
                }

            } else {

                userElementCell = {
                    User: currentUser,
                    ElementCell: elementCell
                };

                switch (elementCell.ElementField.DataType) {
                case 1: { userElementCell.StringValue = value !== null ? value : ''; break; }
                case 2: { userElementCell.BooleanValue = value !== null ? value : false; break; }
                case 3: { userElementCell.IntegerValue = value !== null ? value : 0; break; }
                case 4: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
                case 6: { break; }
                case 11: { userElementCell.DecimalValue = value !== null ? value : 100; break; }
                case 12: { userElementCell.DecimalValue = value !== null ? value : 0; break; }
                }

                userElementCell = dataContext.createEntity('UserElementCell', userElementCell);
            }

            // Update the cache
            if (updateCache) {
                elementCell.setCurrentUserNumericValue();
            }

            return userElementCell;
        }

        function createUserElementField(elementField, rating?) {
            rating = typeof rating !== 'undefined' ? rating : 50;

            var currentUser = dataContext.getCurrentUser();

            // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
            var existingKey = [currentUser.Id, elementField.Id];
            var userElementField = dataContext.getEntityByKey('UserElementField', existingKey);

            if (typeof userElementField !== 'undefined' && userElementField !== null) {

                // If it's deleted, restore it
                if (userElementField.entityAspect.entityState.isDeleted()) {
                    userElementField.entityAspect.rejectChanges();
                }

                userElementField.Rating = rating;

            } else {

                userElementField = {
                    User: currentUser,
                    ElementField: elementField,
                    Rating: rating
                };

                userElementField = dataContext.createEntity('UserElementField', userElementField);
            }

            // Update the cache
            elementField.setCurrentUserIndexRating();

            return userElementField;
        }

        function createUserResourcePool(resourcePool, resourcePoolRate?) {
            resourcePoolRate = typeof resourcePoolRate !== 'undefined' ? resourcePoolRate : 10;

            var currentUser = dataContext.getCurrentUser();

            // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
            var existingKey = [currentUser.Id, resourcePool.Id];
            var userResourcePool = dataContext.getEntityByKey('UserResourcePool', existingKey);

            if (typeof userResourcePool !== 'undefined' && userResourcePool !== null) {

                // If it's deleted, restore it
                if (userResourcePool.entityAspect.entityState.isDeleted()) {
                    userResourcePool.entityAspect.rejectChanges();
                }

                userResourcePool.ResourcePoolRate = resourcePoolRate;

            } else {

                userResourcePool = {
                    User: currentUser,
                    ResourcePool: resourcePool,
                    ResourcePoolRate: resourcePoolRate
                };

                userResourcePool = dataContext.createEntity('UserResourcePool', userResourcePool);
            }

            // Update the cache
            resourcePool.setCurrentUserResourcePoolRate();

            return userResourcePool;
        }

        function elementField_DataTypeChanged(event: any, elementField: any) {

            // Related element cells: Clear old values and set default values if necessary
            elementField.ElementCellSet.forEach(elementCell => {

                elementCell.SelectedElementItemId = null;

                removeUserElementCell(elementCell, false);

                if (elementCell.ElementField.DataType !== 6) {
                    createUserElementCell(elementCell, null, false);
                }
            });
        }

        function elementField_IndexEnabledChanged(event: any, elementField: any) {

            if (elementField.Element === null) {
                return;
            }

            // Add user element field, if IndexEnabled and there is none
            if (elementField.IndexEnabled) {
                createUserElementField(elementField);
            } else {
                removeUserElementField(elementField);
            }
        }

        function getResourcePoolExpanded(resourcePoolUniqueKey: any) {

            // TODO Validations?

            var currentUser = dataContext.getCurrentUser();

            var fetchedEarlier = false;

            // If it's not newly created, check the fetched list
            fetchedEarlier = fetchedList.some(fetched => (resourcePoolUniqueKey === fetched));

            // Prepare the query
            var query = breeze.EntityQuery.from('ResourcePool');

            // Is authorized? No, then get only the public data, yes, then get include user's own records
            if (currentUser.isAuthenticated()) {
                query = query.expand('User, UserResourcePoolSet, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet');
            } else {
                query = query.expand('User, ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet');
            }

            var userNamePredicate = new breeze.Predicate('User.UserName', 'eq', resourcePoolUniqueKey.userName);
            var resourcePoolKeyPredicate = new breeze.Predicate('Key', 'eq', resourcePoolUniqueKey.resourcePoolKey);

            query = query.where(userNamePredicate.and(resourcePoolKeyPredicate));

            // From server or local?
            if (!fetchedEarlier) {
                query = query.using(breeze.FetchStrategy.FromServer);
            } else {
                query = query.using(breeze.FetchStrategy.FromLocalCache);
            }

            return dataContext.executeQuery(query)
                .then(success)
                .catch(failed);

            function success(response: any) {

                // If there is no cmrp with this Id, return null
                if (response.results.length === 0) {
                    return null;
                }

                // ResourcePool
                var resourcePool = response.results[0];

                // Init
                if (!fetchedEarlier) {
                    resourcePool._init();
                }

                // Add the record into fetched list
                fetchedList.push(resourcePool.Id);

                return resourcePool;
            }

            function failed(error: any) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error, true);
            }
        }

        function getResourcePoolSet(searchKey: any) {
            searchKey = typeof searchKey !== 'undefined' ? searchKey : '';

            var query = breeze.EntityQuery
                .from('ResourcePool')
                .expand(['User']);

            if (searchKey !== '') {
                var resourcePoolNamePredicate = new breeze.Predicate('Name', 'contains', searchKey);
                var userNamePredicate = new breeze.Predicate('User.UserName', 'contains', searchKey);
                query = query.where(resourcePoolNamePredicate.or(userNamePredicate));
            }

            // Prepare the query
            //if (fetchFromServer) { // From remote
            query = query.using(breeze.FetchStrategy.FromServer);
            //    fetchFromServer = false; // Do it only once per user
            //}
            //else { // From local
            //query = query.using(breeze.FetchStrategy.FromLocalCache);
            //}

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response: any) {
                return response.results;
            }

            function failed(error: any) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error, true);
            }
        }

        function removeElement(element: any) {

            // Remove from selectedElement
            if (element.ResourcePool.selectedElement() === element) {
                element.ResourcePool.selectedElement(null);
            }

            // Related items
            var elementItemSet = element.ElementItemSet.slice();
            elementItemSet.forEach(elementItem => {
                removeElementItem(elementItem);
            });

            // Related fields
            var elementFieldSet = element.ElementFieldSet.slice();
            elementFieldSet.forEach(elementField => {
                removeElementField(elementField);
            });

            element.entityAspect.setDeleted();
        }

        function removeElementCell(elementCell: any) {

            // Related user cells
            removeUserElementCell(elementCell);

            elementCell.entityAspect.setDeleted();
        }

        function removeElementField(elementField: any) {

            // Related cells
            var elementCellSet = elementField.ElementCellSet.slice();
            elementCellSet.forEach(elementCell => {
                removeElementCell(elementCell);
            });

            // Related user element fields
            removeUserElementField(elementField);

            elementField.entityAspect.setDeleted();
        }

        function removeElementItem(elementItem: any) {

            // Related cells
            var elementCellSet = elementItem.ElementCellSet.slice();
            elementCellSet.forEach(elementCell => {
                removeElementCell(elementCell);
            });

            elementItem.entityAspect.setDeleted();
        }

        function removeResourcePool(resourcePool: any) {

            // Related elements
            var elementSet = resourcePool.ElementSet.slice();
            elementSet.forEach(element => {
                removeElement(element);
            });

            // Related user resource pools
            removeUserResourcePool(resourcePool);

            resourcePool.entityAspect.setDeleted();
        }

        function removeUserElementCell(elementCell, updateCache?) {
            updateCache = typeof updateCache !== 'undefined' ? updateCache : true;

            var currentUserElementCell = elementCell.currentUserCell();

            if (currentUserElementCell !== null) {
                currentUserElementCell.entityAspect.setDeleted();

                if (updateCache) {
                    elementCell.setCurrentUserNumericValue();
                }
            }
        }

        function removeUserElementField(elementField: any) {

            var currentUserElementField = elementField.currentUserElementField();

            if (currentUserElementField !== null) {
                currentUserElementField.entityAspect.setDeleted();

                // Update the cache
                elementField.setCurrentUserIndexRating();
            }
        }

        function removeUserResourcePool(resourcePool: any) {

            var currentUserResourcePool = resourcePool.currentUserResourcePool();

            if (currentUserResourcePool !== null) {
                currentUserResourcePool.entityAspect.setDeleted();

                // Update the cache
                resourcePool.setCurrentUserResourcePoolRate();
            }
        }

        // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
        // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
        // coni2k - 05 Jan. '16
        function syncRowVersion(oldEntity: any, newEntity: any) {
            // TODO Validations?
            oldEntity.RowVersion = newEntity.RowVersion;
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?
        function updateElementCellDecimalValue(elementCell: any, updateType: any) {

            switch (updateType) {
            case 'increase':
            case 'decrease': {

                var userElementCell = elementCell.currentUserCell();

                if (userElementCell === null) { // If there is no item, create it

                    var decimalValue = updateType === 'increase' ? 55 : 45;
                    createUserElementCell(elementCell, decimalValue);

                } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

                    userElementCell.DecimalValue = updateType === 'increase' ?
                        userElementCell.DecimalValue + 5 > 100 ? 100 : userElementCell.DecimalValue + 5 :
                        userElementCell.DecimalValue - 5 < 0 ? 0 : userElementCell.DecimalValue - 5;

                    // Update the cache
                    elementCell.setCurrentUserNumericValue();
                }

                break;
            }
            case 'reset': {

                removeUserElementCell(elementCell);
                break;
            }
            }
        }

        function updateElementCellMultiplier(elementCell: any, updateType: any) {

            updateElementCellMultiplierInternal(elementCell, updateType);

            // Update items
            elementCell.ElementField.Element.ElementItemSet.forEach(item => {
                item.setMultiplier();
            });

            if (elementCell.ElementField.IndexEnabled) {
                // Update numeric value cells
                elementCell.ElementField.ElementCellSet.forEach(cell => {
                    cell.setNumericValueMultiplied(false);
                });

                // Update fields
                elementCell.ElementField.setNumericValueMultiplied();
            }
        }

        function updateElementCellMultiplierInternal(elementCell: any, updateType: any) {

            switch (updateType) {
            case 'increase':
            case 'decrease': {

                var userElementCell = elementCell.currentUserCell();

                if (userElementCell === null) { // If there is no item, create it

                    var decimalValue = updateType === 'increase' ? 1 : 0;
                    createUserElementCell(elementCell, decimalValue, false);

                } else { // If there is an item, update DecimalValue, but cannot be lower than zero

                    userElementCell.DecimalValue = updateType === 'increase' ?
                        userElementCell.DecimalValue + 1 :
                        userElementCell.DecimalValue - 1 < 0 ? 0 : userElementCell.DecimalValue - 1;
                }

                break;
            }
            case 'reset': {

                removeUserElementCell(elementCell, false);
                break;
            }
            }
        }

        function updateElementFieldIndexRating(elementField: any, updateType: any) {

            switch (updateType) {
            case 'increase':
            case 'decrease': {

                var userElementField = elementField.currentUserElementField();

                // If there is no item, create it
                if (userElementField === null) {

                    var rating = updateType === 'increase' ? 55 : 45;
                    createUserElementField(elementField, rating);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                    userElementField.Rating = updateType === 'increase' ?
                        userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                        userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;

                    // Update the cache
                    elementField.setCurrentUserIndexRating();
                }

                break;
            }
            case 'reset': {

                removeUserElementField(elementField);
                break;
            }
            }
        }

        function updateElementMultiplier(element: any, updateType: any) {

            // Find user element cell
            element.ElementItemSet.forEach(item => {

                var multiplierCell;
                for (var cellIndex = 0; cellIndex < item.ElementCellSet.length; cellIndex++) {
                    var elementCell = item.ElementCellSet[cellIndex];
                    if (elementCell.ElementField.DataType === 12) {
                        multiplierCell = elementCell;
                        break;
                    }
                }

                updateElementCellMultiplierInternal(multiplierCell, updateType);
            });

            // Update related

            // Update items
            element.ElementItemSet.forEach(item => {
                item.setMultiplier();
            });

            element.ElementFieldSet.forEach(field => {

                if (field.IndexEnabled) {
                    // Update numeric value cells
                    field.ElementCellSet.forEach(cell => {
                        cell.setNumericValueMultiplied(false);
                    });

                    // Update fields
                    field.setNumericValueMultiplied();
                }
            });
        }

        function updateResourcePoolRate(resourcePool: any, updateType: any) {

            switch (updateType) {
            case 'increase':
            case 'decrease': {

                var userResourcePool = resourcePool.currentUserResourcePool();

                // If there is no item, create it
                if (userResourcePool === null) {

                    var resourcePoolRate = updateType === 'increase' ? 15 : 5;
                    createUserResourcePool(resourcePool, resourcePoolRate);

                } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 1000

                    userResourcePool.ResourcePoolRate = updateType === 'increase' ?
                        userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5 :
                        userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;

                    // Update the cache
                    resourcePool.setCurrentUserResourcePoolRate();
                }

                break;
            }
            case 'reset': {

                removeUserResourcePool(resourcePool);
                break;
            }
            }
        }
    }
}