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
        var manager = null;
        var saveTimer = null;
        var metadataLoaded = false;

        initializeStore();

        // Factory methods
        var factory = {
            createEntity: createEntity,
            clear: clear,
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            hasChanges: hasChanges,
            initializeStore: initializeStore,
            metadataReady: metadataReady,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges
        };

        return factory;

        /*** Implementations ***/

        function createEntityOld(entityType, initialValues) {

            var deferred = $q.defer();

            metadataReady()
                .then(function () {
                    var entity = manager.createEntity(entityType, initialValues);
                    deferred.resolve(entity);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function createEntity(entityType, initialValues) {

            if (!metadataLoaded) {
                logger.logError('Load metadata first!');
                return;
            }

            return manager.createEntity(entityType, initialValues);
        }

        function clear() {
            manager.clear();
        }

        function executeQuery(query) {
            return manager.executeQuery(query);
        }

        function fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst) {
            return manager.fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst);
        }

        function getChanges() {
            return manager.getChanges();
        }

        function getChangesCount() {
            return manager.getChanges().length;
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function initializeStore() {
            manager = entityManagerFactory.newManager();
            
            // TODO Fix this in a better way
            // angular app should start after loading the metadata;
            // https://github.com/angular/angular.js/issues/4003

            metadataReady()
                .then(function () {
                    metadataLoaded = true;
                });
        }

        function metadataReady() {

            var deferred = $q.defer();

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

            return deferred.promise;
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function saveChanges(delay) {

            // Set the default value for delay in case 'undefined'
            if (typeof delay === 'undefined') {
                delay = 0;
            }

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternal();
            } else {
                saveTimer = $timeout(saveChangesInternal, delay);
                return saveTimer;
            }

            // TODO Cancel the timer at the end of the service, like this ?

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

            return metadataReady()
                .then(function () {

                    var count = getChangesCount();
                    var promise = null;
                    var saveBatches = prepareSaveBatches();
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
                        logger.logSuccess('Saved ' + count + ' change(s)', null, false);
                        return result;
                    }

                    function failed(error) {
                        if (typeof error.status !== 'undefined' && error.status === '409') {
                            logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', error, false);
                        } else {
                            logger.logError('Save failed!', error, false);
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
                        var modifiedEntities = manager.getEntities(null, breeze.EntityState.Modified);
                        for (var i = 0; i < modifiedEntities.length; i++) {
                            var entity = modifiedEntities[i];
                            var rowVersion = entity.RowVersion;
                            entity.RowVersion = '';
                            entity.RowVersion = rowVersion;
                        }
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
                        //batches.push(manager.getEntities(['TodoItem'], [breeze.EntityState.Deleted]));
                        //batches.push(manager.getEntities(['TodoList'], [breeze.EntityState.Deleted]));
                        //batches.push(manager.getEntities(['TodoList'], [breeze.EntityState.Added]));

                        // TODO Deleted!

                        batches.push(manager.getEntities(['ResourcePool'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['UserResourcePool'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['Element'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['ElementField'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['UserElementField'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['ElementItem'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['ElementCell'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['UserElementCell'], [breeze.EntityState.Added]));

                        batches.push(null); // empty = save all remaining pending changes
                        return batches;
                        /*
                         *  No we can't flatten into one request because Web API OData reorders
                         *  arbitrarily, causing the database failure we're trying to avoid.
                         */
                    }
                });
        }
    }
})();