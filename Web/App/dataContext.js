/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var serviceId = 'dataContext';
    angular.module('main')
        .factory(serviceId, ['entityManagerFactory', '$q', 'logger', dataContext]);

    function dataContext(entityManagerFactory, $q, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Manager
        var manager = null;
        initializeStore();

        // Service methods
        var service = {
            createEntity: createEntity,
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            hasChanges: hasChanges,
            initializeStore: initializeStore,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges
        };

        return service;

        /*** Implementations ***/

        function createEntity(entityType, initialValues) {

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

        function saveChanges() {

            return metadataReady()
                .then(function () {

                    var count = getChangesCount();
                    var promise = null;
                    var saveBatches = prepareSaveBatches();
                    saveBatches.forEach(function (batch) {
                        // ignore empty batches (except 'null' which means "save everything else")
                        if (batch === null || batch.length > 0) {
                            promise = promise ?
                                promise.then(function () { return manager.saveChanges(batch); }) :
                                manager.saveChanges(batch);
                        }
                    });
                    return promise.then(success).catch(failed);

                    function success(result) {
                        logger.logSuccess('Saved ' + count + ' change(s)', result);
                        return result;
                    }

                    function failed(error) {
                        if (error.status !== 'undefined' && error.status === '409') {
                            logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', null, true);
                        } else {
                            logger.logError('Save failed!', error);
                        }
                        return $q.reject(error); // pass error along to next handler
                    }

                    function prepareSaveBatches() {

                        var batches = [];

                        // RowVersion fix
                        // TODO How about Deleted state?
                        var modifiedEntities = manager.getEntities(null, breeze.EntityState.Modified);
                        for (var i = 0; i < modifiedEntities.length; i++) {
                            var entity = modifiedEntities[i];
                            if (entity.entityAspect.entityState === breeze.EntityState.Modified) {
                                var rowVersion = entity.RowVersion;
                                entity.RowVersion = '';
                                entity.RowVersion = rowVersion;
                            }
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
                        //batches.push(manager.getEntities(['License'], [breeze.EntityState.Deleted]));
                        //batches.push(manager.getEntities(['License'], [breeze.EntityState.Added]));

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