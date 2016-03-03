(function () {
    'use strict';

    var factoryId = 'userFactory';
    angular.module('main')
        .config(['$provide', extendFactory]);

    function extendFactory($provide) {
        $provide.decorator(factoryId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', '$window', '$location', 'serviceAppUrl', 'logger', userFactory]);
    }

    function userFactory($delegate, dataContext, $http, $q, $rootScope, $window, $location, serviceAppUrl, logger) {
        logger = logger.forSource(factoryId);

        // Service urls
        var addPasswordUrl = serviceAppUrl + '/api/Account/AddPassword';
        var changeEmailUrl = serviceAppUrl + '/api/Account/ChangeEmail';
        var changePasswordUrl = serviceAppUrl + '/api/Account/ChangePassword';
        var confirmEmailUrl = serviceAppUrl + '/api/Account/ConfirmEmail';
        var currentUser = null;
        var getCurrentUserPromise = null;
        var registerUrl = serviceAppUrl + '/api/Account/Register';
        var resendConfirmationEmailUrl = serviceAppUrl + '/api/Account/ResendConfirmationEmail';
        var resetPasswordUrl = serviceAppUrl + '/api/Account/ResetPassword';
        var resetPasswordRequestUrl = serviceAppUrl + '/api/Account/ResetPasswordRequest';
        var tokenUrl = serviceAppUrl + '/api/Token';

        // Service methods
        $delegate.addPassword = addPassword;
        $delegate.changeEmail = changeEmail;
        $delegate.changePassword = changePassword;
        $delegate.confirmEmail = confirmEmail;
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.getToken = getToken;
        $delegate.logout = logout;
        $delegate.register = register;
        $delegate.resendConfirmationEmail = resendConfirmationEmail;
        $delegate.resetPassword = resetPassword;
        $delegate.resetPasswordRequest = resetPasswordRequest;

        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellMultiplier = updateElementCellMultiplier;
        $delegate.updateElementCellNumericValue = updateElementCellNumericValue;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        _init();

        function _init() {
            getCurrentUser()
                .then(function () {
                    broadcastUserChanged();
                });
        }

        return $delegate;

        /*** Implementations ***/

        function addPassword(addPasswordBindingModel) {
            return $http.post(addPasswordUrl, addPasswordBindingModel)
                .success(function (updatedUser) {

                    // Remove 'HasNoPassword' claim
                    var claimIndex = null;
                    for (var i = 0; i < currentUser.Claims.length; i++) {
                        if (currentUser.Claims[i].ClaimType === 'HasNoPassword') {
                            claimIndex = i;
                            break;
                        }
                    }

                    if (claimIndex === null) {
                        // TODO throw error?
                    }

                    var claims = currentUser.Claims.splice(claimIndex, 1);
                    claims[0].entityAspect.setDetached();

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

        function confirmEmail(confirmEmailBindingModel) {
            return $http.post(confirmEmailUrl, confirmEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.EmailConfirmed = true;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function getToken(email, password, rememberMe, tempToken, isRegister) {
            isRegister = typeof isRegister === 'undefined' ? false : isRegister;

            var deferred = $q.defer();

            var tokenData = 'grant_type=password' +
                '&username=' + email +
                '&password=' + password +
                '&rememberMe=' + rememberMe +
                '&tempToken=' + (typeof tempToken !== 'undefined' ? tempToken : '');

            $http.post(tokenUrl, tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (token) {

                    // Set token to the session
                    $window.localStorage.setItem('token', angular.toJson(token));

                    // Set currentUser as the old one.
                    // In case if this is coming from login page, anonymous changes will be merged/copied into logged in user
                    var oldUser = currentUser;

                    getCurrentUser(!isRegister)
                        .then(function () {

                            if (isRegister) {

                                // Raise logged in event
                                broadcastUserChanged();

                                // Update anonymous entities
                                currentUser.ResourcePoolSet.forEach(function (resourcePool) {
                                    resourcePool.updateAnonymousEntities();
                                });

                                // Save the changes that's been done before the registration
                                dataContext.saveChanges()
                                    .then(function () {
                                        deferred.resolve();
                                    });
                            } else {

                                // Raise logged in event
                                broadcastUserChanged();

                                // Move anonymously created entities to this logged in user
                                dataContext.updateAnonymousChanges(oldUser, currentUser)
                                    .then(function () {

                                        // Update anonymous entities
                                        currentUser.ResourcePoolSet.forEach(function (resourcePool) {
                                            resourcePool.updateAnonymousEntities();
                                        });

                                        // Save changes
                                        dataContext.saveChanges()
                                            .then(function () {
                                                deferred.resolve();
                                            });
                                    });
                            }
                        });
                })
                .error(function (data, status, headers, config) {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        // Returns either anonymous (not authenticated) or logged in user
        function getCurrentUser(resetPromise) {
            resetPromise = typeof resetPromise !== 'undefined' ? resetPromise : false;

            if (getCurrentUserPromise === null || resetPromise) {

                var deferred = $q.defer();
                getCurrentUserPromise = deferred.promise;

                if (localStorage.getItem('token') === null) {

                    dataContext.metadataReady()
                        .then(function () {
                            var user = dataContext.createEntity('User', { isEditing: false });
                            currentUser = user;
                            deferred.resolve(user);
                        })
                        .catch(function () {
                            // TODO Handle?
                        });

                } else {
                    var query = breeze.EntityQuery
                        .from('Users')
                        .expand('Claims')
                        .using(breeze.FetchStrategy.FromServer);

                    dataContext.executeQuery(query)
                        .then(success)
                        .catch(failed);
                }
            }

            return getCurrentUserPromise;

            function success(response) {

                // If the response has an entity, use that, otherwise create an anonymous user
                var user = response.results.length > 0 ?
                    response.results[0] :
                    dataContext.createEntity('User', { isEditing: false });

                currentUser = user;
                deferred.resolve(user);
            }

            function failed(error) {
                var message = error.message || 'User query failed';
                // TODO Handle this case better!
                deferred.reject(message);
                throw new Error(message);
            }
        }

        function getUserElementCell(user, elementCell) {

            var userCell = elementCell.currentUserCell();

            if (userCell === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserCells = dataContext.getEntities(['UserElementCell'], [breeze.EntityState.Deleted]);
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
                var deletedUserFields = dataContext.getEntities(['UserElementField'], [breeze.EntityState.Deleted]);
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
                var deletedUserResourcePools = dataContext.getEntities(['UserResourcePool'], [breeze.EntityState.Deleted]);
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

        function logout() {

            // Remove token from the session
            $window.localStorage.removeItem('token');

            // Clear breeze's metadata store
            dataContext.clear();

            // Raise logged out event
            return getCurrentUser(true)
                .then(function () {
                    broadcastUserChanged();
                });
        }

        function broadcastUserChanged() {
            $rootScope.$broadcast('userFactory_currentUserChanged', currentUser);
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .success(function (newUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = newUser.Id;
                    currentUser.Email = newUser.Email;
                    currentUser.UserName = newUser.UserName;
                    currentUser.RowVersion = newUser.RowVersion;
                    currentUser.entityAspect.acceptChanges();

                    return getToken(registerBindingModel.email, registerBindingModel.password, false, true);
                })
                .error(handleErrorResult);
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

                        userCell = dataContext.createEntity('UserElementCell', {
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

                        dataContext.createEntity('UserElementCell', {
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

                        dataContext.createEntity('UserElementField', userElementField);

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

                        dataContext.createEntity('UserResourcePool', userResourcePool);

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
