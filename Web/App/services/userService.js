
(function () {
    'use strict';

    var serviceId = 'userService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', '$window', 'logger', userService]);
        });

    function userService($delegate, dataContext, $http, $q, $rootScope, $window, logger) {
        logger = logger.forSource(serviceId);

        var accessTokenUrl = '/api/Token';
        var changePasswordUrl = '/api/Account/ChangePassword';
        var logoutUrl = '/api/Account/Logout';
        var registerUrl = '/api/Account/Register';

        var currentUser = null;
        var getCurrentUserPromise = null;
        var isAuthenticatedPromise = null;

        // Service methods
        $delegate.changePassword = changePassword;
        $delegate.getAccessToken = getAccessToken;
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.isAuthenticated = isAuthenticated;
        $delegate.logout = logout;
        $delegate.register = register;

        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellNumericValue = updateElementCellNumericValue;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        return $delegate;

        /*** Implementations ***/

        function changePassword(changePasswordBindingModel) {
            return $http.post(changePasswordUrl, changePasswordBindingModel)
        }

        function getAccessToken(email, password, resetDataContext) {
            var accessTokenData = 'grant_type=password&username=' + email + '&password=' + password;

            return $http.post(accessTokenUrl, accessTokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (data) {

                    // Set access token to the session
                    $window.localStorage.setItem('access_token', data.access_token);

                    // Clear user promise
                    getCurrentUserPromise = null;
                    isAuthenticatedPromise = null;

                    // Clear breeze's metadata store
                    if (resetDataContext) {
                        dataContext.clear();
                    }

                    // Get current user
                    getCurrentUser()
                        .then(function (currentUser) {

                            // Raise logged in event
                            $rootScope.$broadcast('userLoggedIn', { currentUser: currentUser });

                        });
                })
        }

        function getCurrentUser() {

            var deferred = $q.defer();

            if (getCurrentUserPromise === null) {
                getCurrentUserPromise = deferred.promise;

                var query = breeze.EntityQuery
                    .from('Users')
                    .using(breeze.FetchStrategy.FromServer);

                dataContext.executeQuery(query)
                    .then(success)
                    .catch(failed);
            }

            return getCurrentUserPromise;

            function success(response) {

                if (response.results.length > 0) {
                    currentUser = response.results[0];
                    deferred.resolve(currentUser);

                } else {
                    dataContext.createEntity('User', {})
                            .then(function (newUser) {
                                currentUser = newUser;
                                deferred.resolve(currentUser);
                            })
                    .catch(function () {
                        currentUser = null;
                        deferred.reject();
                    });
                }
            }

            function failed(error) {
                var message = error.message || 'User query failed';
                deferred.reject(message);
            }
        }

        function isAuthenticated() {

            var deferred = $q.defer();

            if (isAuthenticatedPromise === null) {
                isAuthenticatedPromise = deferred.promise;

                getCurrentUser()
                    .then(function (currentUser) {
                        deferred.resolve(currentUser.Id > 0);
                    })
                    .catch(function () {
                        deferred.reject();
                    });
            }

            return isAuthenticatedPromise;
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .success(function (newUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = newUser.Id;
                    currentUser.Email = newUser.Email;
                    currentUser.UserName = newUser.UserName;
                    currentUser.entityAspect.acceptChanges();

                })
                .error(function (data, status, headers, config) {

                    // TODO
                    //logger.logError('Error!', { data: data, status: status, headers: headers, config: config });
                    if (typeof data.ModelState !== 'undefined') {
                        var modelErrors = Object.keys(data.ModelState);
                        logger.logError(data.ModelState[modelErrors], data.ModelState[modelErrors], true);
                    }
                });
        }

        function logout() {
            return $http.post(logoutUrl)
                .success(function () {

                    // Remove access token from the session
                    $window.localStorage.removeItem('access_token');

                    // Clear user promise
                    getCurrentUserPromise = null;
                    isAuthenticatedPromise = null;

                    // Clear breeze's metadata store
                    dataContext.clear();

                    // Raise logged out event
                    $rootScope.$broadcast('userLoggedOut');
                })
                .error(function (data, status, headers, config) {

                    // TODO
                    //logger.logError('Error!', { data: data, status: status, headers: headers, config: config });
                    if (typeof data.ModelState !== 'undefined') {
                        var modelErrors = Object.keys(data.ModelState);
                        logger.logError(data.ModelState[modelErrors], data.ModelState[modelErrors], true);
                    }
                });
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?

        function updateElementMultiplier(element, updateType) {

            // Find user element cell
            for (var i = 0; i < element.ElementItemSet.length; i++) {
                var elementItem = element.ElementItemSet[i];
                var elementCell = elementItem.multiplierCell();
                updateElementCellMultiplier(elementCell, updateType);
            }
        }

        function updateElementCellMultiplier(elementCell, updateType) {

            if (elementCell.CurrentUserCell !== null
                && typeof elementCell.CurrentUserCell.entityAspect !== 'undefined'
                && elementCell.CurrentUserCell.entityAspect.entityState.isDetached()) {
                elementCell.CurrentUserCell = null;
            }

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (elementCell.CurrentUserCell === null) {

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: 1
                        }).then(function (newUserCell) {
                            elementCell.CurrentUserCell = newUserCell;

                            // Update the cached value
                            elementCell.ElementItem.setMultiplier();
                        });

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 1
                        if (elementCell.CurrentUserCell.entityAspect.entityState.isDeleted()) {
                            elementCell.CurrentUserCell.entityAspect.rejectChanges();
                            elementCell.CurrentUserCell.DecimalValue = 1;
                        } else { // Otherwise, go ahead!
                            elementCell.CurrentUserCell.DecimalValue++;
                        }

                        // Update the cached value
                        elementCell.ElementItem.setMultiplier();
                    }

                    break;
                }
                case 'decrease': {

                    // If there is an item, decrease
                    if (elementCell.CurrentUserCell !== null) {
                        elementCell.CurrentUserCell.DecimalValue = elementCell.CurrentUserCell.DecimalValue - 1 < 0 ? 0 : elementCell.CurrentUserCell.DecimalValue - 1;

                        // Update the cached value
                        elementCell.ElementItem.setMultiplier();
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (elementCell.CurrentUserCell !== null && !elementCell.CurrentUserCell.entityAspect.entityState.isDeleted()) {
                        elementCell.CurrentUserCell.DecimalValue = 0;
                        elementCell.CurrentUserCell.entityAspect.setDeleted();

                        // Update the cached value
                        elementCell.ElementItem.setMultiplier();
                    }

                    break;
                }
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            if (elementCell.CurrentUserCell !== null
                && typeof elementCell.CurrentUserCell.entityAspect !== 'undefined'
                && elementCell.CurrentUserCell.entityAspect.entityState.isDetached()) {
                elementCell.CurrentUserCell = null;
            }

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (elementCell.CurrentUserCell === null) {

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: typeof value !== 'undefined' ? value : 55
                        }).then(function (newUserCell) {
                            elementCell.CurrentUserCell = newUserCell;

                            // Update the cached value
                            elementCell.setCurrentUserNumericValue();
                        });

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 5
                        if (typeof elementCell.CurrentUserCell.entityAspect != 'undefined'
                            && elementCell.CurrentUserCell.entityAspect.entityState.isDeleted()) {
                            elementCell.CurrentUserCell.entityAspect.rejectChanges();
                            elementCell.CurrentUserCell.DecimalValue = 55;
                        } else { // Otherwise, go ahead!
                            elementCell.CurrentUserCell.DecimalValue = elementCell.CurrentUserCell.DecimalValue + 5 > 100
                                ? 100
                                : elementCell.CurrentUserCell.DecimalValue + 5;
                        }

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create it
                    if (elementCell.CurrentUserCell === null) {

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: 45
                        }).then(function (newUserCell) {
                            elementCell.CurrentUserCell = newUserCell;

                            // Update the cached value
                            elementCell.setCurrentUserNumericValue();
                        });

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default - 5
                        if (elementCell.CurrentUserCell.entityAspect.entityState.isDeleted()) {
                            elementCell.CurrentUserCell.entityAspect.rejectChanges();
                            elementCell.CurrentUserCell.DecimalValue = 45;
                        } else { // Otherwise, go ahead!
                            elementCell.CurrentUserCell.DecimalValue = elementCell.CurrentUserCell.DecimalValue - 5 < 0 ? 0 : elementCell.CurrentUserCell.DecimalValue - 5;
                        }

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (elementCell.CurrentUserCell !== null && !elementCell.CurrentUserCell.entityAspect.entityState.isDeleted()) {
                        elementCell.CurrentUserCell.DecimalValue = 50;
                        elementCell.CurrentUserCell.entityAspect.setDeleted();

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
            }
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = elementField.currentUserElementField();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            User: currentUser,
                            ElementField: elementField,
                            Rating: 55
                        };

                        dataContext.createEntity('UserElementField', userElementField);

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 5
                        if (userElementField.entityAspect.entityState.isDeleted()) {
                            userElementField.entityAspect.rejectChanges();
                            userElementField.Rating = 55;
                        } else { // Otherwise, go ahead!
                            userElementField.Rating = userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            User: currentUser,
                            ElementField: elementField,
                            Rating: 45
                        };

                        dataContext.createEntity('UserElementField', userElementField);

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default - 5
                        if (userElementField.entityAspect.entityState.isDeleted()) {
                            userElementField.entityAspect.rejectChanges();
                            userElementField.Rating = 45;
                        } else { // Otherwise, go ahead!
                            userElementField.Rating = userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userElementField !== null && !userElementField.entityAspect.entityState.isDeleted()) {
                        userElementField.Rating = 50;
                        userElementField.entityAspect.setDeleted();
                    }

                    break;
                }
            }

            // Broadcast the update
            if (userElementField !== null) {
                $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: elementField, value: userElementField.Rating });
            }
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = resourcePool.userResourcePool();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            User: currentUser,
                            ResourcePool: resourcePool,
                            ResourcePoolRate: 15
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to 15
                        if (userResourcePool.entityAspect.entityState.isDeleted()) {
                            userResourcePool.entityAspect.rejectChanges();
                            userResourcePool.ResourcePoolRate = 15;
                        } else { // Otherwise, go ahead!
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create
                    if (userResourcePool === null) {
                        userResourcePool = {
                            User: currentUser,
                            ResourcePool: resourcePool,
                            ResourcePoolRate: 5
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to 5
                        if (userResourcePool.entityAspect.entityState.isDeleted()) {
                            userResourcePool.entityAspect.rejectChanges();
                            userResourcePool.ResourcePoolRate = 5;
                        } else { // Otherwise, go ahead!
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userResourcePool !== null && !userResourcePool.entityAspect.entityState.isDeleted()) {
                        userResourcePool.ResourcePoolRate = 10;
                        userResourcePool.entityAspect.setDeleted();
                    }

                    break;
                }
            }

            // Broadcast the update
            if (userResourcePool !== null) {
                $rootScope.$broadcast('resourcePoolRateUpdated', { resourcePool: resourcePool, value: userResourcePool.ResourcePoolRate });
            }
        }
    }

})();
