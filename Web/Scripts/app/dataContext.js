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
    angular.module('main').factory(serviceId,
    ['$q', 'logger', 'entityManagerFactory', dataContext]);

    function dataContext($q, logger, entityManagerFactory) {

        // Logger
        logger = logger.forSource(serviceId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;
        var logWarning = logger.logWarning;

        // entityManager
        var manager = entityManagerFactory.newManager();

        // To determine whether the data will be fecthed from server or local
        var minimumDate = new Date(0);
        var licenseSetFetchedOn = minimumDate;

        // Service methods (alphabetically)
        var service = {
            createLicense: createLicense,
            deleteLicense: deleteLicense,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getLicenseSet: getLicenseSet,
            getLicense: getLicense,
            hasChanges: hasChanges,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges
        };

        return service;

        /*** Implementations ***/

        function createLicense(license) {
            return manager.createEntity('License', license);
        }

        function deleteLicense(license) {
            license.entityAspect.setDeleted();
        }

        function getChanges() {
            return manager.getChanges();
        }

        function getChangesCount() {
            return manager.getChanges().length;
        }

        function getLicenseSet(forceRefresh) {
            //logWarning('licenseSetFetchedOn: ' + licenseSetFetchedOn, null, true);

            var count;
            if (forceRefresh) {
                if (manager.hasChanges()) {
                    count = getChangesCount();
                    manager.rejectChanges(); // undo all unsaved changes!
                    logWarning('Discarded ' + count + ' pending change(s)', null, true);
                }
            }

            var query = breeze.EntityQuery.from("License");

            // Fetch the data from server, in case if it's not fetched earlier or forced
            var fetchFromServer = licenseSetFetchedOn === minimumDate || forceRefresh;

            // Prepare the query
            if (fetchFromServer) { // From remote
                query = query.using(breeze.FetchStrategy.FromServer)
                licenseSetFetchedOn = new Date();
                //logWarning('Fetched from server', null, true);
            }
            else { // From local
                query = query.using(breeze.FetchStrategy.FromLocalCache)
                //logWarning('Fetched from local', null, true);
            }

            return manager.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {

                count = response.results.length;
                logSuccess('Got ' + count + ' license(s)', response, true);
                return response.results;
            }

            function failed(error) {
                var message = error.message || "License query failed";
                logError(message, error, true);
            }
        }

        function getLicense(licenseId, forceRefresh) {
            return manager.fetchEntityByKey("License", licenseId, !forceRefresh)
                .then(success).catch(failed);

            function success(result) {
                //logSuccess('Got license with Id: ' + result.entity.Id, result, true);
                return result.entity;
            }

            function failed(error) {
                var message = error.message || "getLicense query failed";
                logError(message, error, true);
            }
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function isMetadataEmpty() {
            var result = manager.metadataStore.isEmpty();

            logWarning(result, null, true);

            return result;
        }

        function fetchMetadata() {
            return manager.fetchMetadata();
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function saveChanges() {

            var count = getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches();
            saveBatches.forEach(function (batch) {
                // ignore empty batches (except 'null' which means "save everything else")
                if (batch == null || batch.length > 0) {

                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });
            return promise.then(success).catch(failed);

            function success(result) {
                logSuccess('Saved ' + count + ' change(s)', result, true);
            }

            function failed(error) {
                var msg = 'Save failed. ' + (error.message || "");
                error.message = msg;
                logError(msg, error, true);
                return $q.reject(error); // pass error along to next handler
            }

            function prepareSaveBatches() {
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
                var batches = [];
                batches.push(manager.getEntities(['License'], [breeze.EntityState.Deleted]));
                batches.push(manager.getEntities(['License'], [breeze.EntityState.Added]));
                batches.push(null); // empty = save all remaining pending changes
                return batches;
                /*
                 *  No we can't flatten into one request because Web API OData reorders
                 *  arbitrarily, causing the database failure we're trying to avoid.
                 */
            }
        }
    }
})();