/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var factoryId = 'dataContext';
    angular.module('main')
        .factory(factoryId, ['entityManagerFactory', '$q', '$rootScope', '$timeout', 'logger', dataContext]);

    function dataContext(entityManagerFactory, $q, $rootScope, $timeout, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Manager
        var currentUser = { isAuthenticated: function () { return false; } };
        var manager = null;
        var metadataReadyPromise = null;
        var saveTimer = null;

        // Factory methods
        var factory = {
            clear: clear,
            createEntity: createEntity,
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getEntities: getEntities,
            hasChanges: hasChanges,
            metadataReady: metadataReady,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges,
            saveChangesAlt: saveChangesAlt,
            updateAnonymousChanges: updateAnonymousChanges
        };

        // Event handlers
        $rootScope.$on('ElementField_createUserElementCell', createUserElementCell);
        $rootScope.$on('userFactory_currentUserChanged', currentUserChanged);

        _init();

        return factory;

        /*** Implementations ***/

        function _init() {
            manager = entityManagerFactory.newManager();
        }

        function clear() {
            manager.clear();
        }

        function createEntity(entityType, initialValues) {

            // All entities will be created in isEditing state by default
            if (typeof initialValues.isEditing === 'undefined') {
                initialValues.isEditing = true;
            }

            return manager.createEntity(entityType, initialValues);
        }

        function createUserElementCell(event, userElementCell) {
            return createEntity('UserElementCell', userElementCell);
        }

        function currentUserChanged(event, newUser) {
            currentUser = newUser;
        }

        function executeQuery(query) {
            return manager.executeQuery(query);
        }

        function fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst) {
            return manager.fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst);
        }

        function getChanges(entityTypeName, entityState) {
            entityTypeName = typeof entityTypeName !== 'undefined' ? entityTypeName : null;
            entityState = typeof entityState !== 'undefined' ? entityState : null;

            var all = manager.getChanges();
            var changes = [];

            // Filters
            all.forEach(function (change) {
                if (!change.isEditing &&
                    (entityTypeName === null || change.entityType.shortName === entityTypeName) &&
                    (entityState === null || change.entityAspect.entityState === entityState)) {
                    changes.push(change);
                }
            });

            return changes;
            // return manager.getChanges();
        }

        function getChangesCount() {
            return getChanges().length;
            // return manager.getChanges().length;
        }

        function getEntities(entityTypes, entityStates) {
            return manager.getEntities(entityTypes, entityStates);
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function metadataReady() {

            if (metadataReadyPromise === null) {

                var deferred = $q.defer();

                metadataReadyPromise = deferred.promise;

                if (manager.metadataStore.isEmpty()) {
                    manager.fetchMetadata()
                        .then(function () {
                            deferred.resolve();
                        },
                        function (error) {
                            deferred.reject(error);
                        });
                } else {
                    deferred.resolve();
                }
            }

            return metadataReadyPromise;
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function saveChanges(delay) {
            delay = typeof delay !== 'undefined' ? delay : 0;

            // Anonymous user check
            if (!currentUser.isAuthenticated()) {
                $rootScope.$broadcast('anonymousUserInteracted');
                return $q.reject({});
            }

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternal();
            } else {
                saveTimer = $timeout(function () {
                    saveChangesInternal();
                }, delay);
                return saveTimer;
            }

            // TODO Is it necessary to cancel the timer at the end of the service, like this ?

            //// When the DOM element is removed from the page,
            //// AngularJS will trigger the $destroy event on
            //// the scope. This gives us a chance to cancel any
            //// pending timer that we may have.
            //$scope.$on("$destroy", function (event) {
            //    $timeout.cancel(increaseMultiplierTimeoutInitial);
            //    $timeout.cancel(increaseMultiplierTimeoutRecursive);
            //});
        }

        function saveChangesInternal() {

            var count = getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches();
            saveBatches.forEach(function (batch) {

                // ignore empty batches (except 'null' which means "save everything else")
                if (batch === null || batch.length > 0) {

                    logger.log('batch', batch);

                    // Broadcast, so UI can block
                    $rootScope.$broadcast('saveChangesStart');

                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });

            // There is nothing to save?
            if (promise === null) {
                promise = $q.resolve(null);
            }

            return promise.then(success).catch(failed).finally(completed);

            function success(result) {
                logger.logSuccess('Saved ' + count + ' change(s)');
                return result;
            }

            function failed(error) {
                if (typeof error.status !== 'undefined' && error.status === '409') {
                    logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', error, true);
                } else if (typeof error.entityErrors !== 'undefined') {

                    var errorMessage = 'Save failed!<br />';

                    for (var key in error.entityErrors) {
                        var entityError = error.entityErrors[key];
                        errorMessage += entityError.errorMessage + '<br />';
                    }

                    logger.logError(errorMessage, null, true);

                } else {
                    logger.logError('Save failed!', error, true);
                }

                return $q.reject(error); // pass error along to next handler
            }

            function completed() {

                // Broadcast, so UI can unblock
                $rootScope.$broadcast('saveChangesCompleted');
            }

            function prepareSaveBatches() {

                var batches = [];

                // RowVersion fix
                // TODO How about Deleted state?
                var modifiedEntities = getChanges(null, breeze.EntityState.Modified);
                modifiedEntities.forEach(function (entity) {
                    var rowVersion = entity.RowVersion;
                    entity.RowVersion = '';
                    entity.RowVersion = rowVersion;
                });
                batches.push(modifiedEntities);

                /* Aaargh! 
                * Web API OData doesn't calculate the proper save order
                * which means, if we aren't careful on the client,
                * we could save a new TodoItem before we saved its parent new TodoList
                * or delete the parent TodoList before saving its deleted child TodoItems.
                * OData says it is up to the client to save entities in the order
                * required by referential constraints of the database.
                * While we could save each time you make a change, that sucks.
                * So we'll divvy up the pending changes into 4 batches
                * 1. Deleted Todos
                * 2. Deleted TodoLists
                * 3. Added TodoLists
                * 4. Every other change
                */

                batches.push(getChanges('UserElementCell', breeze.EntityState.Deleted));
                batches.push(getChanges('ElementCell', breeze.EntityState.Deleted));
                batches.push(getChanges('ElementItem', breeze.EntityState.Deleted));
                batches.push(getChanges('UserElementField', breeze.EntityState.Deleted));
                batches.push(getChanges('ElementField', breeze.EntityState.Deleted));
                batches.push(getChanges('Element', breeze.EntityState.Deleted));
                batches.push(getChanges('UserResourcePool', breeze.EntityState.Deleted));
                batches.push(getChanges('ResourcePool', breeze.EntityState.Deleted));

                batches.push(getChanges('ResourcePool', breeze.EntityState.Added));
                batches.push(getChanges('UserResourcePool', breeze.EntityState.Added));
                batches.push(getChanges('Element', breeze.EntityState.Added));
                batches.push(getChanges('ElementField', breeze.EntityState.Added));
                batches.push(getChanges('UserElementField', breeze.EntityState.Added));
                batches.push(getChanges('ElementItem', breeze.EntityState.Added));
                batches.push(getChanges('ElementCell', breeze.EntityState.Added));
                batches.push(getChanges('UserElementCell', breeze.EntityState.Added));

                // batches.push(null); // empty = save all remaining pending changes

                return batches;
                /*
                 *  No we can't flatten into one request because Web API OData reorders
                 *  arbitrarily, causing the database failure we're trying to avoid.
                 */
            }
        }

        function saveChangesAlt(entities, delay) {
            delay = typeof delay !== 'undefined' ? delay : 0;

            // Anonymous user check
            if (!currentUser.isAuthenticated()) {
                $rootScope.$broadcast('anonymousUserInteracted');
                return $q.reject({});
            }

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternalAlt(entities);
            } else {
                saveTimer = $timeout(function () {
                    saveChangesInternalAlt(entities);
                }, delay);
                return saveTimer;
            }

            // TODO Is it necessary to cancel the timer at the end of the service, like this ?

            //// When the DOM element is removed from the page,
            //// AngularJS will trigger the $destroy event on
            //// the scope. This gives us a chance to cancel any
            //// pending timer that we may have.
            //$scope.$on("$destroy", function (event) {
            //    $timeout.cancel(increaseMultiplierTimeoutInitial);
            //    $timeout.cancel(increaseMultiplierTimeoutRecursive);
            //});
        }

        function saveChangesInternalAlt(entities) {

            var count = entities.length; // getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches(entities);
            saveBatches.forEach(function (batch) {

                // ignore empty batches (except 'null' which means "save everything else")
                if (batch === null || batch.length > 0) {

                    // Broadcast, so UI can block
                    $rootScope.$broadcast('saveChangesStart');

                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });
            return promise.then(success).catch(failed).finally(completed);

            function success(result) {
                logger.logSuccess('Saved ' + count + ' change(s)');
                return result;
            }

            function failed(error) {
                if (typeof error.status !== 'undefined' && error.status === '409') {
                    logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', error, true);
                } else if (typeof error.entityErrors !== 'undefined') {

                    var errorMessage = 'Save failed!<br />';

                    for (var key in error.entityErrors) {
                        var entityError = error.entityErrors[key];
                        errorMessage += entityError.errorMessage + '<br />';
                    }

                    logger.logError(errorMessage, null, true);

                } else {
                    logger.logError('Save failed!', error, true);
                }

                return $q.reject(error); // pass error along to next handler
            }

            function completed() {

                // Broadcast, so UI can unblock
                $rootScope.$broadcast('saveChangesCompleted');
            }

            function prepareSaveBatches(entities) {

                var batches = [];

                // RowVersion fix
                // TODO How about Deleted state?
                var modifiedEntities = [];
                entities.forEach(function (entity) {
                    if (entity.entityAspect.entityState.isModified()) {
                        var rowVersion = entity.RowVersion;
                        entity.RowVersion = '';
                        entity.RowVersion = rowVersion;
                        modifiedEntities.push(entity);
                    }
                });
                batches.push(modifiedEntities);

                /* Aaargh! 
                * Web API OData doesn't calculate the proper save order
                * which means, if we aren't careful on the client,
                * we could save a new TodoItem before we saved its parent new TodoList
                * or delete the parent TodoList before saving its deleted child TodoItems.
                * OData says it is up to the client to save entities in the order
                * required by referential constraints of the database.
                * While we could save each time you make a change, that sucks.
                * So we'll divvy up the pending changes into 4 batches
                * 1. Deleted Todos
                * 2. Deleted TodoLists
                * 3. Added TodoLists
                * 4. Every other change
                */

                batches.push(getEntities(entities, 'UserElementCell', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ElementCell', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ElementItem', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'UserElementField', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ElementField', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'Element', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'UserResourcePool', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ResourcePool', breeze.EntityState.Deleted));

                batches.push(getEntities(entities, 'ResourcePool', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'UserResourcePool', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'Element', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'ElementField', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'UserElementField', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'ElementItem', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'ElementCell', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'UserElementCell', breeze.EntityState.Added));

                function getEntities(entities, typeName, entityState) {
                    var result = [];

                    entities.forEach(function (entity) {
                        if (entity.entityType.shortName === typeName && entity.entityAspect.entityState === entityState) {
                            result.push(entity);
                        }
                    });

                    return result;
                }

                // batches.push(null); // empty = save all remaining pending changes

                return batches;
                /*
                 *  No we can't flatten into one request because Web API OData reorders
                 *  arbitrarily, causing the database failure we're trying to avoid.
                 */
            }
        }

        // When the user interact with the application without registering or login in,
        // it creates an anonymous user and all entity creations done by this user
        // If the user has actually an account and logs in afterwards, this function moves all those changes to that logged in user
        function updateAnonymousChanges(anonymousUser, newUser) {

            var deferred = $q.defer();

            if (typeof anonymousUser === 'undefined' || anonymousUser === null) {
                deferred.reject('anonymousUser parameter cannot be undefined or null');
            }

            if (typeof newUser === 'undefined' || newUser === null) {
                deferred.reject('newUser parameter cannot be undefined or null');
            }

            var existingEntityPromises = [];
            anonymousUser.UserResourcePoolSet.forEach(function (userResourcePool) {
                var keyValues = [newUser.Id, userResourcePool.ResourcePoolId];
                var promise = fetchEntityByKey('UserResourcePool', keyValues);
                existingEntityPromises.push(promise);
            });

            anonymousUser.UserElementFieldSet.forEach(function (userElementField) {
                var keyValues = [newUser.Id, userElementField.ElementFieldId];
                var promise = fetchEntityByKey('UserElementField', keyValues);
                existingEntityPromises.push(promise);
            });

            anonymousUser.UserElementCellSet.forEach(function (userElementCell) {
                var keyValues = [newUser.Id, userElementCell.ElementCellId];
                var promise = fetchEntityByKey('UserElementCell', keyValues);
                existingEntityPromises.push(promise);
            });

            $q.all(existingEntityPromises).then(function () {

                // Resource pools
                anonymousUser.ResourcePoolSet.forEach(function (anonymousResourcePool) {
                    anonymousResourcePool.User = newUser;
                });

                // User resource pools
                var userResourcePoolSet = anonymousUser.UserResourcePoolSet.slice();
                userResourcePoolSet.forEach(function (anonymousUserResourcePool) {

                    var result = newUser.UserResourcePoolSet.filter(function (userResourcePool) {
                        return userResourcePool.ResourcePoolId === anonymousUserResourcePool.ResourcePoolId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].ResourcePoolRate = anonymousUserResourcePool.ResourcePoolRate;
                        anonymousUserResourcePool.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserResourcePool.User = newUser;
                    }
                });

                // User element fields
                var userElementFieldSet = anonymousUser.UserElementFieldSet.slice();
                userElementFieldSet.forEach(function (anonymousUserElementField) {

                    // If existing entity, then make it modified
                    var result = newUser.UserElementFieldSet.filter(function (userElementField) {
                        return userElementField.ElementFieldId === anonymousUserElementField.ElementFieldId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].Rating = anonymousUserElementField.Rating;
                        anonymousUserElementField.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserElementField.User = newUser;
                    }
                });

                // User element cells
                var userElementCellSet = anonymousUser.UserElementCellSet.slice();
                userElementCellSet.forEach(function (anonymousUserElementCell) {

                    // If existing entity, then make it modified
                    var result = newUser.UserElementCellSet.filter(function (userElementCell) {
                        return userElementCell.ElementCellId === anonymousUserElementCell.ElementCellId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].StringValue = anonymousUserElementCell.StringValue;
                        result[0].BooleanValue = anonymousUserElementCell.BooleanValue;
                        result[0].IntegerValue = anonymousUserElementCell.IntegerValue;
                        result[0].DecimalValue = anonymousUserElementCell.DecimalValue;
                        result[0].DateTimeValue = anonymousUserElementCell.DateTimeValue;
                        anonymousUserElementCell.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserElementCell.User = newUser;
                    }
                });

                // Remove the old (anonymous) user
                anonymousUser.entityAspect.rejectChanges();

                deferred.resolve();
            });

            return deferred.promise;
        }
    }
})();