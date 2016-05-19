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
        .factory(factoryId, ['entityManagerFactory', 'logger', 'serviceAppUrl', '$http', '$q', '$rootScope', '$timeout', '$window', dataContext]);

    function dataContext(entityManagerFactory, logger, serviceAppUrl, $http, $q, $rootScope, $timeout, $window) {

        // Logger
        logger = logger.forSource(factoryId);

        // Service urls
        var addPasswordUrl = serviceAppUrl + '/api/Account/AddPassword';
        var changeEmailUrl = serviceAppUrl + '/api/Account/ChangeEmail';
        var changePasswordUrl = serviceAppUrl + '/api/Account/ChangePassword';
        var changeUserNameUrl = serviceAppUrl + '/api/Account/ChangeUserName';
        var confirmEmailUrl = serviceAppUrl + '/api/Account/ConfirmEmail';
        var registerUrl = serviceAppUrl + '/api/Account/Register';
        var registerAnonymousUrl = serviceAppUrl + '/api/Account/RegisterAnonymous';
        var resendConfirmationEmailUrl = serviceAppUrl + '/api/Account/ResendConfirmationEmail';
        var resetPasswordUrl = serviceAppUrl + '/api/Account/ResetPassword';
        var resetPasswordRequestUrl = serviceAppUrl + '/api/Account/ResetPasswordRequest';
        var tokenUrl = serviceAppUrl + '/api/Token';

        // In create entity function, it checks whether the user is authenticated or not.
        // If not, then broadcasts it, so we can force user to register or login.
        // However, there are some entities that the application has to create for the user (currentUser, sample resourcepools etc.)
        // In those cases, it should stop doing this check, so this flag will be used.
        // SH - 10 Mar. '16
        var _createEntitySuppressAuthValidation = false;
        var currentUser = null;
        var fetchedUsers = [];
        var getCurrentUserPromise = null;
        var manager = null;
        var metadataReadyPromise = null;
        var saveTimer = null;

        // Factory methods
        var factory = {
            addPassword: addPassword,
            changeEmail: changeEmail,
            changePassword: changePassword,
            changeUserName: changeUserName,
            confirmEmail: confirmEmail,
            createEntity: createEntity,
            createEntitySuppressAuthValidation: createEntitySuppressAuthValidation,
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getCurrentUser: getCurrentUser,
            getEntities: getEntities,
            getToken: getToken,
            getUniqueEmail: getUniqueEmail,
            getUniqueUserName: getUniqueUserName,
            getUser: getUser,
            hasChanges: hasChanges,
            login: login,
            logout: logout,
            metadataReady: metadataReady,
            register: register,
            registerAnonymous: registerAnonymous,
            rejectChanges: rejectChanges,
            resendConfirmationEmail: resendConfirmationEmail,
            resetPassword: resetPassword,
            resetPasswordRequest: resetPasswordRequest,
            saveChanges: saveChanges,
            updateElementMultiplier: updateElementMultiplier,
            updateElementCellMultiplier: updateElementCellMultiplier,
            updateElementCellNumericValue: updateElementCellNumericValue,
            updateElementFieldIndexRating: updateElementFieldIndexRating,
            updateResourcePoolRate: updateResourcePoolRate
        };

        // Event handlers
        $rootScope.$on('ElementField_createUserElementCell', createUserElementCell);

        _init();

        return factory;

        /*** Implementations ***/

        function _init() {
            manager = entityManagerFactory.newManager();
        }

        function addPassword(addPasswordBindingModel) {
            return $http.post(addPasswordUrl, addPasswordBindingModel)
                .success(function (updatedUser) {

                    currentUser.HasPassword = null;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changeEmail(changeEmailBindingModel) {
            return $http.post(changeEmailUrl, changeEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.Email = updatedUser.Email;
                    currentUser.EmailConfirmed = false;
                    currentUser.IsAnonymous = false;
                    currentUser.UserName = updatedUser.UserName;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changePassword(changePasswordBindingModel) {
            return $http.post(changePasswordUrl, changePasswordBindingModel)
                .success(function (updatedUser) {
                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changeUserName(changeUserNameBindingModel) {
            return $http.post(changeUserNameUrl, changeUserNameBindingModel)
                .success(function (updatedUser) {

                    currentUser.UserName = updatedUser.UserName;

                    // Update token as well
                    var token = angular.fromJson($window.localStorage.getItem('token'));
                    token.userName = updatedUser.UserName;
                    $window.localStorage.setItem('token', angular.toJson(token));

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function confirmEmail(confirmEmailBindingModel) {
            return $http.post(confirmEmailUrl, confirmEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.EmailConfirmed = true;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function createEntitySuppressAuthValidation(value) {
            _createEntitySuppressAuthValidation = value;
        }

        function createEntity(entityType, initialValues) {

            // All entities will be created in isEditing state by default
            if (typeof initialValues.isEditing === 'undefined') {
                initialValues.isEditing = true;
            }

            // Broadcast if unauthorized user creates a new entity (interact with the system)
            if (!_createEntitySuppressAuthValidation && !currentUser.isAuthenticated()) {
                $rootScope.$broadcast('unauthenticatedUserInteracted');
            }

            return manager.createEntity(entityType, initialValues);
        }

        function createUserElementCell(event, userElementCell) {
            return createEntity('UserElementCell', userElementCell);
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

        // Returns either unauthenticated or logged in user
        function getCurrentUser(resetPromise) {
            resetPromise = typeof resetPromise !== 'undefined' ? resetPromise : false;

            if (getCurrentUserPromise === null || resetPromise) {

                var deferred = $q.defer();
                getCurrentUserPromise = deferred.promise;

                if ($window.localStorage.getItem('token') === null) {

                    metadataReady()
                        .then(function () {
                            currentUser = getAnonymousUser();
                            $rootScope.$broadcast('dataContext_currentUserChanged', currentUser);
                            deferred.resolve(currentUser);
                        })
                        .catch(function () {
                            // TODO Handle?
                            deferred.reject();
                        });

                } else {

                    var token = angular.fromJson($window.localStorage.getItem('token'));
                    var userName = token.userName;
                    var query = breeze.EntityQuery
                        .from('Users')
                        .expand('ResourcePoolSet')
                        .where('UserName', 'eq', userName)
                        .using(breeze.FetchStrategy.FromServer);

                    executeQuery(query)
                        .then(success)
                        .catch(failed);
                }
            }

            return getCurrentUserPromise;

            function success(response) {

                // If the response has an entity, use that, otherwise create an anonymous user
                if (response.results.length > 0) {
                    currentUser = response.results[0];
                } else {
                    $window.localStorage.removeItem('token'); // TODO Invalid token, expired?

                    if (currentUser === null) {
                        currentUser = getAnonymousUser();
                    }
                }

                $rootScope.$broadcast('dataContext_currentUserChanged', currentUser);
                deferred.resolve(currentUser);
            }

            function failed(error) {
                var message = error.message || 'User query failed';
                // TODO Handle this case better!
                deferred.reject(message);
                throw new Error(message);
            }
        }

        function getToken(userName, password, rememberMe, singleUseToken) {

            var deferred = $q.defer();

            var tokenData = 'grant_type=password' +
                '&username=' + userName +
                '&password=' + password +
                '&rememberMe=' + rememberMe +
                '&singleUseToken=' + singleUseToken;

            $http.post(tokenUrl, tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (token) {

                    // Set token to the session
                    $window.localStorage.setItem('token', angular.toJson(token));
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function getAnonymousUser() {
            _createEntitySuppressAuthValidation = true;
            var user = createEntity('User', {
                Email: getUniqueEmail(),
                UserName: getUniqueUserName(),
                FirstName: '',
                MiddleName: '',
                LastName: '',
                IsAnonymous: true,
                isEditing: false
            });
            _createEntitySuppressAuthValidation = false;
            return user;
        }

        function getUniqueEmail() {

            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            return 'user_' + year + month + day + '_' + hour + minute + second + '@forcrowd.org';
        }

        function getUniqueUserName() {

            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            return 'user_' + year + month + day + '_' + hour + minute + second;
        }

        function getUser(userName) {

            // Already fetched, then query locally
            var alreadyFetched = fetchedUsers.some(function (fetched) {
                return userName === fetched;
            });

            var query = breeze.EntityQuery
                .from('Users')
                .expand('ResourcePoolSet')
                .where('UserName', 'eq', userName);

            // From server or local?
            if (alreadyFetched) {
                query = query.using(breeze.FetchStrategy.FromLocalCache);
            } else {
                query = query.using(breeze.FetchStrategy.FromServer);
            }

            return executeQuery(query)
                .then(success)
                .catch(failed);

            function success(response) {

                // If there is no result
                if (response.results.length === 0) {
                    return null;
                }

                var user = response.results[0];

                // Add to fetched list
                fetchedUsers.push(user.UserName);

                return user;
            }

            function failed(error) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error, true);
            }
        }

        function getUserElementCell(user, elementCell) {

            var userCell = elementCell.currentUserCell();

            if (userCell === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserCells = getEntities(['UserElementCell'], [breeze.EntityState.Deleted]);
                var userCells = deletedUserCells.filter(function (deletedUserCell) {
                    return deletedUserCell.UserId === user.Id && deletedUserCell.ElementCellId === elementCell.Id;
                });

                if (userCells.length > 0) {
                    userCell = userCells[0];
                    userCell.entityAspect.rejectChanges();
                    userCell.DecimalValue = elementCell.ElementField.DataType === 12 ? 0 : 50; // TODO ?
                }
            }

            return userCell;
        }

        function getUserElementField(user, elementField) {

            var userField = elementField.currentUserElementField();

            if (userField === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserFields = getEntities(['UserElementField'], [breeze.EntityState.Deleted]);
                var userFields = deletedUserFields.filter(function (deletedUserField) {
                    return deletedUserField.UserId === user.Id && deletedUserField.ElementFieldId === elementField.Id;
                });

                if (userFields.length > 0) {
                    userField = userFields[0];
                    userField.entityAspect.rejectChanges();
                    userField.Rating = 50;
                }
            }

            return userField;
        }

        function getUserResourcePool(user, resourcePool) {

            var userResourcePool = resourcePool.currentUserResourcePool();

            if (userResourcePool === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserResourcePools = getEntities(['UserResourcePool'], [breeze.EntityState.Deleted]);
                var userResourcePools = deletedUserResourcePools.filter(function (deletedUserResourcePool) {
                    return deletedUserResourcePool.UserId === user.Id && deletedUserResourcePool.ResourcePoolId === resourcePool.Id;
                });

                if (userResourcePools.length > 0) {
                    userResourcePool = userResourcePools[0];
                    userResourcePool.entityAspect.rejectChanges();
                    userResourcePool.ResourcePoolRate = 10;
                }
            }

            return userResourcePool;
        }

        function handleErrorResult(data, status, headers, config) {

            // TODO Can this be done on a higher level?
            var message = '';

            if (typeof data.ModelState !== 'undefined') {
                for (var key in data.ModelState) {
                    var array = data.ModelState[key];
                    array.forEach(addErrorMessage);
                }
            }

            function addErrorMessage(error) {
                message += error + '<br />';
            }

            if (message === '' && typeof data.Message !== 'undefined') {
                message = data.Message;
            }

            if (message === '' && typeof data.error_description !== 'undefined') {
                message = data.error_description;
            }

            logger.logError(message, null, true);
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function login(userName, password, rememberMe, singleUseToken) {

            return getToken(userName, password, rememberMe, singleUseToken)
                .then(function () {

                    // Clear breeze's metadata store etc.
                    manager.clear();
                    fetchedUsers = [];

                    return getCurrentUser(true);
                });
        }

        function logout() {

            // Remove token from the session
            $window.localStorage.removeItem('token');

            // Clear breeze's metadata store
            manager.clear();
            fetchedUsers = [];

            // Raise logged out event
            return getCurrentUser(true);
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

        function register(registerBindingModel, rememberMe) {

            var deferred = $q.defer();

            $http.post(registerUrl, registerBindingModel, rememberMe)
                .success(function (updatedUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = updatedUser.Id;
                    currentUser.UserName = updatedUser.UserName;
                    currentUser.Email = updatedUser.Email;
                    currentUser.IsAnonymous = updatedUser.IsAnonymous;
                    currentUser.HasPassword = updatedUser.HasPassword;
                    currentUser.SingleUseToken = updatedUser.SingleUseToken;
                    currentUser.RowVersion = updatedUser.RowVersion;
                    currentUser.entityAspect.acceptChanges();

                    getToken(registerBindingModel.UserName, registerBindingModel.Password, rememberMe)
                        .then(function () {

                            // Save the changes that's been done before the registration
                            saveChanges()
                                .then(function () {
                                    deferred.resolve();
                                })
                                .catch(function () {
                                    deferred.reject();
                                });
                        })
                        .catch(function () {
                            deferred.reject();
                        });
                })
                .error(function (data, status, headers, config) {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function registerAnonymous(registerAnonymousBindingModel, rememberMe) {

            var deferred = $q.defer();

            $http.post(registerAnonymousUrl, registerAnonymousBindingModel)
                .success(function (updatedUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = updatedUser.Id;
                    currentUser.Email = updatedUser.Email;
                    currentUser.UserName = updatedUser.UserName;
                    currentUser.IsAnonymous = updatedUser.IsAnonymous;
                    currentUser.HasPassword = updatedUser.HasPassword;
                    currentUser.SingleUseToken = updatedUser.SingleUseToken;
                    currentUser.RowVersion = updatedUser.RowVersion;
                    currentUser.entityAspect.acceptChanges();

                    getToken('', '', rememberMe, updatedUser.SingleUseToken)
                        .then(function () {

                            // Save the changes that's been done before the registration
                            saveChanges()
                                .then(function () {
                                    deferred.resolve();
                                })
                                .catch(function () {
                                    deferred.reject();
                                });
                        })
                        .catch(function () {
                            deferred.reject();
                        });
                })
                .error(function (data, status, headers, config) {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function resendConfirmationEmail() {
            return $http.post(resendConfirmationEmailUrl).error(handleErrorResult);
        }

        function resetPassword(resetPasswordBindingModel) {
            return $http.post(resetPasswordUrl, resetPasswordBindingModel)
                .success(function (updatedUser) {
                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function resetPasswordRequest(resetPasswordRequestBindingModel) {
            return $http.post(resetPasswordRequestUrl, resetPasswordRequestBindingModel).error(handleErrorResult);
        }

        function saveChanges(delay) {
            delay = typeof delay !== 'undefined' ? delay : 0;

            if (!currentUser.isAuthenticated()) {
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

            function failed(error, status, headers, config) {

                //console.log('error', error);
                //for (var keyx in error) {
                //    console.log(keyx + ': ' + error[keyx]);
                //}

                var errorMessage = '';

                if (typeof error.status !== 'undefined' && error.status === '409') {
                    errorMessage = typeof error.body !== 'undefined' ?
                        'Save failed!<br />' + error.body :
                        'Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.';

                    logger.logError(errorMessage, error, true);
                } else if (typeof error.entityErrors !== 'undefined') {

                    errorMessage = 'Save failed!<br />';

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

        // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
        // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
        // SH - 05 Jan. '16
        function syncRowVersion(oldEntity, newEntity) {
            // TODO Validations?
            oldEntity.RowVersion = newEntity.RowVersion;
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?
        function updateElementCellMultiplier(elementCell, updateType) {

            updateElementCellMultiplierInternal(elementCell, updateType);

            // Update items
            elementCell.ElementField.Element.ElementItemSet.forEach(function (item) {
                item.setMultiplier();
            });

            if (elementCell.ElementField.IndexEnabled) {
                // Update numeric value cells
                elementCell.ElementField.ElementCellSet.forEach(function (cell) {
                    cell.setNumericValueMultiplied(false);
                });

                // Update fields
                elementCell.ElementField.setNumericValueMultiplied();
            }
        }

        function updateElementCellMultiplierInternal(elementCell, updateType) {

            var userCell = getUserElementCell(currentUser, elementCell);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    if (userCell === null) { // If there is no item, create it

                        userCell = createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: updateType === 'increase' ? 1 : 0,
                            isEditing: false
                        });

                    } else { // If there is an item, update DecimalValue, but cannot be lower than zero

                        userCell.DecimalValue = updateType === 'increase' ?
                            userCell.DecimalValue + 1 :
                            userCell.DecimalValue - 1 < 0 ? 0 : userCell.DecimalValue - 1;
                    }

                    break;
                }
                case 'reset': {

                    if (userCell !== null) { // If there is an item, delete it
                        userCell.entityAspect.setDeleted();
                    }

                    break;
                }
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            var userCell = getUserElementCell(currentUser, elementCell);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    if (userCell === null) { // If there is no item, create it

                        createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: updateType === 'increase' ? 55 : 45,
                            isEditing: false
                        });

                    } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

                        userCell.DecimalValue = updateType === 'increase' ?
                            userCell.DecimalValue + 5 > 100 ? 100 : userCell.DecimalValue + 5 :
                            userCell.DecimalValue - 5 < 0 ? 0 : userCell.DecimalValue - 5;
                    }

                    // Update the cached value
                    elementCell.setCurrentUserNumericValue();

                    break;
                }
                case 'reset': {

                    if (userCell !== null) { // If there is an item, delete it
                        userCell.entityAspect.setDeleted();

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
            }
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = getUserElementField(currentUser, elementField);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            User: currentUser,
                            ElementField: elementField,
                            Rating: updateType === 'increase' ? 55 : 45,
                            isEditing: false
                        };

                        createEntity('UserElementField', userElementField);

                    } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                        userElementField.Rating = updateType === 'increase' ?
                            userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                            userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                    }

                    // Update the cached value
                    elementField.setCurrentUserIndexRating();

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementField !== null) {
                        userElementField.entityAspect.setDeleted();

                        // Update the cached value
                        elementField.setCurrentUserIndexRating();
                    }

                    break;
                }
            }
        }

        function updateElementMultiplier(element, updateType) {

            // Find user element cell
            element.ElementItemSet.forEach(function (item) {

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
            element.ElementItemSet.forEach(function (item) {
                item.setMultiplier();
            });

            element.ElementFieldSet.forEach(function (field) {

                if (field.IndexEnabled) {
                    // Update numeric value cells
                    field.ElementCellSet.forEach(function (cell) {
                        cell.setNumericValueMultiplied(false);
                    });

                    // Update fields
                    field.setNumericValueMultiplied();
                }
            });
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = getUserResourcePool(currentUser, resourcePool);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            User: currentUser,
                            ResourcePool: resourcePool,
                            ResourcePoolRate: updateType === 'increase' ? 15 : 5,
                            isEditing: false
                        };

                        createEntity('UserResourcePool', userResourcePool);

                    } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 1000

                        userResourcePool.ResourcePoolRate = updateType === 'increase' ?
                            userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5 :
                            userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;
                    }

                    // Update the cached value
                    resourcePool.setCurrentUserResourcePoolRate();

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userResourcePool !== null) {
                        userResourcePool.entityAspect.setDeleted();

                        // Update the cached value
                        resourcePool.setCurrentUserResourcePoolRate();
                    }

                    break;
                }
            }
        }
    }
})();