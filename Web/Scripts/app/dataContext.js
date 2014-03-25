/***
 * Service: datacontext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('main').factory(serviceId,
    ['$q', 'entityManagerFactory', datacontext]);

    function datacontext($q, emFactory) {
        //logger = logger.forSource(serviceId);
        //var logError = logger.logError;
        //var logSuccess = logger.logSuccess;
        //var logWarning = logger.logWarning;

        var manager = emFactory.newManager();

        var service = {
            getChangesCount: getChangesCount,
            getHasChanges: hasChanges,
            getLicenseSet: getLicenseSet,
            getLicense: getLicense,
            deleteLicense: deleteLicense,
            createLicense: createLicense,
            createTodoItem: createTodoItem,
            deleteTodoItem: deleteTodoItem,
            deleteTodoList: deleteTodoList,
            save: save
        };

        return service;

        /*** implementation ***/

        function createLicense(license) {

            license.CreatedOn = new Date();
            license.ModifiedOn = new Date();

            // var created = new Date().toUTCString();
            //initialValues = initialValues || { title: '[New TodoList]' };
            //initialValues.created = initialValues.created || created;
            // return manager.createEntity('TodoList', initialValues);

            //if (!hasMetadata()) {
            //    manager.fetchMetadata(emFactory.serviceName)
            //        .then(function () {
            //            return manager.createEntity('License', license);
            //        })
            //        .fail(function (exception) {
            //            // TODO ?!
            //    });
            //}
            //else {
            return manager.createEntity('License', license);
            //}
        }

        function createTodoItem(initialValues) {
            // Todo: guard against missing initialValues?
            return manager.createEntity('TodoItem', initialValues);
        }

        function deleteTodoItem(todoItem) {
            todoItem.entityAspect.setDeleted();
        }

        function deleteLicense(license) {
            license.entityAspect.setDeleted();
        }

        function deleteTodoList(todoList) {
            // first mark deleted all the child TodoItems (via copies)
            var todoCopies = todoList.todoItems.slice();
            todoCopies.forEach(function (td) { td.entityAspect.setDeleted(); });
            // now mark deleted the parent TodoList 
            todoList.entityAspect.setDeleted();
        }

        function getChangesCount() {
            return manager.getChanges().length;
        }

        function getLicenseSet(forceRefresh) {

            var count;
            if (forceRefresh) {
                if (manager.hasChanges()) {
                    count = getChangesCount();
                    manager.rejectChanges(); // undo all unsaved changes!
                    //logWarning('Discarded ' + count + ' pending change(s)', null, true);
                }
            }

            //Todo: when no forceRefresh, consider getting from cache rather than remotely
            return breeze.EntityQuery.from("License")
                // .orderBy("createdOn")
                // .expand("TodoItems")
                .using(manager).execute()
                .then(success).catch(failed);

            function success(response) {

                // console.log(response);

                count = response.results.length;
                //logSuccess('Got ' + count + ' todolist(s)', response, true);
                return response.results;
            }
            function failed(error) {
                var message = error.message || "todolists query failed";
                console.log("datacontext - getLicenseSet - failed: " + message);
                //logError(message, error, true);
            }
        }

        function getLicense(licenseId) {

            console.log("datacontext - getLicense");

            //Todo: when no forceRefresh, consider getting from cache rather than remotely
            return breeze.EntityQuery.from("License")
                .where("Id", "==", licenseId)
                // .orderBy("createdOn")
                // .expand("TodoItems")
                .using(manager).execute()
                .then(success).catch(failed);

            function success(response) {

                // console.log(response);

                var count = response.results.length;
                //logSuccess('Got ' + count + ' todolist(s)', response, true);
                return response.results;
            }
            function failed(error) {
                var message = error.message || "todolists query failed";
                console.log("datacontext - getLicenseSet - failed: " + message);
                //logError(message, error, true);
            }
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        //function hasMetadata() {
        //    return manager.metadataStore.hasMetadataFor(emFactory.serviceName);
        //}

        function save() {

            console.log('datacontext - saving');

            var count = getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches();
            saveBatches.forEach(function (batch) {
                // ignore empty batches (except 'null' which means "save everything else")
                if (batch == null || batch.length > 0) {

                    console.log('datacontext - saving');

                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });
            return promise.then(success).catch(failed);

            function success(result) {
                //logSuccess('Saved ' + count + ' change(s)', result, true);
            }

            function failed(error) {
                var msg = 'Save failed. ' + (error.message || "");
                error.message = msg;
                //logError(msg, error, true);
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
                //batches.push(manager.getEntities(['TodoList'], [breeze.EntityState.Deleted]));
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