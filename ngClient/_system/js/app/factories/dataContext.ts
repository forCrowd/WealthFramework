/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
module Main.Factories {
    'use strict';

    var factoryId = 'dataContext';

    export function dataContext(entityManagerFactory: any,
        logger: any,
        serviceAppUrl: any,
        $http: any,
        $q: any,
        $rootScope: any,
        $timeout: any,
        $window: any) {

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

        var currentUser = null;
        var fetchedUsers = [];
        var initializeCurrentUserPromise = null;
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
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getCurrentUser: getCurrentUser,
            getEntities: getEntities,
            getEntityByKey: getEntityByKey,
            getToken: getToken,
            getUniqueEmail: getUniqueEmail,
            getUniqueUserName: getUniqueUserName,
            getUser: getUser,
            hasChanges: hasChanges,
            initializeCurrentUser: initializeCurrentUser,
            login: login,
            logout: logout,
            metadataReady: metadataReady,
            register: register,
            registerAnonymous: registerAnonymous,
            rejectChanges: rejectChanges,
            resendConfirmationEmail: resendConfirmationEmail,
            resetPassword: resetPassword,
            resetPasswordRequest: resetPasswordRequest,
            saveChanges: saveChanges
        };

        _init();

        return factory;

        /*** Implementations ***/

        function _init() {
            manager = entityManagerFactory.newManager();
        }

        function addPassword(addPasswordBindingModel: any) {
            return $http.post(addPasswordUrl, addPasswordBindingModel)
                .success(updatedUser => {

                    currentUser.HasPassword = null;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();
                })
                .error(handleErrorResult);
        }

        function changeEmail(changeEmailBindingModel: any) {
            return $http.post(changeEmailUrl, changeEmailBindingModel)
                .success(updatedUser => {

                    currentUser.Email = updatedUser.Email;
                    currentUser.EmailConfirmed = false;
                    currentUser.IsAnonymous = false;
                    currentUser.UserName = updatedUser.UserName;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();

                    $rootScope.$broadcast('dataContext_currentUserEmailAddressChanged');
                })
                .error(handleErrorResult);
        }

        function changePassword(changePasswordBindingModel: any) {
            return $http.post(changePasswordUrl, changePasswordBindingModel)
                .success(updatedUser => {

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();
                })
                .error(handleErrorResult);
        }

        function changeUserName(changeUserNameBindingModel: any) {
            return $http.post(changeUserNameUrl, changeUserNameBindingModel)
                .success(updatedUser => {

                    currentUser.UserName = updatedUser.UserName;

                    // Update token as well
                    var token = angular.fromJson($window.localStorage.getItem('token'));
                    token.userName = updatedUser.UserName;
                    $window.localStorage.setItem('token', angular.toJson(token));

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();
                })
                .error(handleErrorResult);
        }

        function confirmEmail(confirmEmailBindingModel: any) {
            return $http.post(confirmEmailUrl, confirmEmailBindingModel)
                .success(updatedUser => {

                    currentUser.EmailConfirmed = true;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();
                })
                .error(handleErrorResult);
        }

        function createEntity(entityType, initialValues, entityState?, mergeStrategy?) {
            return manager.createEntity(entityType, initialValues, entityState, mergeStrategy);
        }

        function createGuestUser() {
            var user = createEntity('User', {
                Email: getUniqueEmail(),
                UserName: getUniqueUserName(),
                FirstName: '',
                MiddleName: '',
                LastName: '',
                IsAnonymous: true
            });
            user.entityAspect.acceptChanges();
            return user;
        }

        function executeQuery(query: any) {
            return manager.executeQuery(query);
        }

        function fetchEntityByKey(typeName: any, keyValues: any, checkLocalCacheFirst: any) {
            return manager.fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst);
        }

        function getChanges(entityTypeName?: any, entityState?: any) {
            entityTypeName = typeof entityTypeName !== 'undefined' ? entityTypeName : null;
            entityState = typeof entityState !== 'undefined' ? entityState : null;

            var all = manager.getChanges();
            var changes = [];

            // Filters
            all.forEach(change => {
                if ((entityTypeName === null || change.entityType.shortName === entityTypeName) &&
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

        function getCurrentUser() {
            return currentUser;
        }

        function getEntities(entityTypes: any, entityStates: any) {
            return manager.getEntities(entityTypes, entityStates);
        }

        function getEntityByKey(entityType: any, entityKey: any) {
            return manager.getEntityByKey(entityType, entityKey);
        }

        function getToken(userName, password, rememberMe, singleUseToken?) {

            var deferred = $q.defer();

            var tokenData = 'grant_type=password' +
                '&username=' + userName +
                '&password=' + password +
                '&rememberMe=' + rememberMe +
                '&singleUseToken=' + singleUseToken;

            $http.post(tokenUrl, tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(token => {

                    // Set token to the session
                    $window.localStorage.setItem('token', angular.toJson(token));
                    deferred.resolve();
                })
                .error((data, status, headers, config) => {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function getUniqueEmail() {
            return getUniqueUserName() + '@forcrowd.org';
        }

        function getUniqueUserName() {

            var now = new Date();
            var year = now.getFullYear().toString().substring(2);
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            return 'guest' + year + month + day + hour + minute + second;
        }

        function getUser(userName: any) {

            // Already fetched, then query locally
            var alreadyFetched = fetchedUsers.some(fetched => (userName === fetched));

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

            function success(response: any);
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

            function failed(error: any);
            function failed(error) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error, true);
            }
        }

        function handleErrorResult(data: any, status: any, headers: any, config: any) {

            // TODO Can this be done on a higher level?
            var message = '';

            if (typeof data.ModelState !== 'undefined') {
                for (var key in data.ModelState) {
                    var array = data.ModelState[key];
                    array.forEach(addErrorMessage);
                }
            }

            function addErrorMessage(error: any) {
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
            return getChanges().length > 0;
            //return manager.hasChanges();
        }

        // Returns either unauthenticated or logged in user
        function initializeCurrentUser(resetPromise: any) {
            resetPromise = typeof resetPromise !== 'undefined' ? resetPromise : false;

            if (initializeCurrentUserPromise === null || resetPromise) {

                var deferred = $q.defer();
                initializeCurrentUserPromise = deferred.promise;

                if ($window.localStorage.getItem('token') === null) {

                    metadataReady()
                        .then(() => {
                            currentUser = createGuestUser();
                            $rootScope.$broadcast('dataContext_currentUserChanged', currentUser);
                            deferred.resolve(currentUser);
                        })
                        .catch(() => {
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

            return initializeCurrentUserPromise;

            function success(response: any) {

                // If the response has an entity, use that, otherwise create an anonymous user
                if (response.results.length > 0) {
                    currentUser = response.results[0];
                } else {
                    $window.localStorage.removeItem('token'); // TODO Invalid token, expired?

                    if (currentUser === null) {
                        currentUser = createGuestUser();
                    }
                }

                $rootScope.$broadcast('dataContext_currentUserChanged', currentUser);
                deferred.resolve(currentUser);
            }

            function failed(error: any) {
                var message = error.message || 'User query failed';
                // TODO Handle this case better!
                deferred.reject(message);
                throw new Error(message);
            }
        }

        function login(userName: any, password: any, rememberMe: any, singleUseToken: any) {

            return getToken(userName, password, rememberMe, singleUseToken)
                .then(() => {

                    // Clear breeze's metadata store etc.
                    manager.clear();
                    fetchedUsers = [];

                    return initializeCurrentUser(true);
                });
        }

        function logout() {

            // Remove token from the session
            $window.localStorage.removeItem('token');

            // Clear breeze's metadata store
            manager.clear();
            fetchedUsers = [];

            // Raise logged out event
            return initializeCurrentUser(true);
        }

        function metadataReady() {

            if (metadataReadyPromise === null) {

                var deferred = $q.defer();

                metadataReadyPromise = deferred.promise;

                if (manager.metadataStore.isEmpty()) {
                    manager.fetchMetadata()
                        .then(() => {
                                deferred.resolve();
                            },
                            error => {
                                deferred.reject(error);
                            });
                } else {
                    deferred.resolve();
                }
            }

            return metadataReadyPromise;
        }

        function register(registerBindingModel: any, rememberMe: any) {

            var deferred = $q.defer();

            $http.post(registerUrl, registerBindingModel, rememberMe)
                .success(updatedUser => {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = updatedUser.Id;
                    currentUser.UserName = updatedUser.UserName;
                    currentUser.Email = updatedUser.Email;
                    currentUser.IsAnonymous = updatedUser.IsAnonymous;
                    currentUser.HasPassword = updatedUser.HasPassword;
                    currentUser.SingleUseToken = updatedUser.SingleUseToken;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();

                    getToken(registerBindingModel.UserName, registerBindingModel.Password, rememberMe)
                        .then(() => {

                            // Save the changes that's been done before the registration
                            saveChanges()
                                .then(() => {
                                    deferred.resolve();
                                })
                                .catch(() => {
                                    deferred.reject();
                                });
                        })
                        .catch(() => {
                            deferred.reject();
                        });
                })
                .error((data, status, headers, config) => {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function registerAnonymous(registerAnonymousBindingModel: any, rememberMe: any) {

            var deferred = $q.defer();

            $http.post(registerAnonymousUrl, registerAnonymousBindingModel)
                .success(updatedUser => {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = updatedUser.Id;
                    currentUser.Email = updatedUser.Email;
                    currentUser.UserName = updatedUser.UserName;
                    currentUser.IsAnonymous = updatedUser.IsAnonymous;
                    currentUser.HasPassword = updatedUser.HasPassword;
                    currentUser.SingleUseToken = updatedUser.SingleUseToken;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();

                    getToken('', '', rememberMe, updatedUser.SingleUseToken)
                        .then(() => {

                            // Save the changes that's been done before the registration
                            saveChanges()
                                .then(() => {
                                    deferred.resolve();
                                })
                                .catch(() => {
                                    deferred.reject();
                                });
                        })
                        .catch(() => {
                            deferred.reject();
                        });
                })
                .error((data, status, headers, config) => {
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

        function resetPassword(resetPasswordBindingModel: any) {
            return $http.post(resetPasswordUrl, resetPasswordBindingModel)
                .success(updatedUser => {

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);

                    currentUser.entityAspect.acceptChanges();
                })
                .error(handleErrorResult);
        }

        function resetPasswordRequest(resetPasswordRequestBindingModel: any) {
            return $http.post(resetPasswordRequestUrl, resetPasswordRequestBindingModel).error(handleErrorResult);
        }

        function ensureAuthenticatedUser() {

            var deferred = $q.defer();

            if (currentUser.isAuthenticated()) {
                deferred.resolve();

            } else {

                var bindingModel = {
                    UserName: currentUser.UserName,
                    Email: currentUser.Email
                };

                registerAnonymous(bindingModel, true)
                    .then(() => {
                        $rootScope.$broadcast('guestAccountCreated');
                        deferred.resolve();
                    })
                    .catch(() => {
                        deferred.reject();
                    });
            }

            return deferred.promise;
        }

        function saveChanges(delay?) {
            delay = typeof delay !== 'undefined' ? delay : 0;

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternal();
            } else {
                saveTimer = $timeout(() => {
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

            return ensureAuthenticatedUser()
                .then(() => {

                    var promise = null;
                    var count = getChangesCount();
                    var saveBatches = prepareSaveBatches();
                    saveBatches.forEach(batch => {

                        // ignore empty batches (except 'null' which means "save everything else")
                        if (batch === null || batch.length > 0) {

                            // Broadcast, so UI can block
                            $rootScope.$broadcast('saveChangesStart');

                            promise = promise ?
                                promise.then(() => manager.saveChanges(batch)) :
                                manager.saveChanges(batch);
                        }
                    });

                    // There is nothing to save?
                    if (promise === null) {
                        promise = $q.resolve(null);
                    }

                    return promise.then(success).catch(failed).finally(completed);

                    function success(result: any) {
                        logger.logSuccess('Saved ' + count + ' change(s)');
                        return result;
                    }

                    function failed(error: any, status: any, headers: any, config: any) {

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
                        modifiedEntities.forEach(entity => {
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
                });
        }

        // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
        // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
        // coni2k - 05 Jan. '16
        function syncRowVersion(oldEntity: any, newEntity: any) {
            // TODO Validations?
            oldEntity.RowVersion = newEntity.RowVersion;
        }
    }

    dataContext.$inject = ['entityManagerFactory', 'logger', 'serviceAppUrl', '$http', '$q', '$rootScope', '$timeout', '$window'];

    angular.module('main').factory(factoryId, dataContext);
}