
(function () {
    'use strict';

    var factoryId = 'userFactory';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(factoryId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', '$window', 'logger', userFactory]);
        });

    function userFactory($delegate, dataContext, $http, $q, $rootScope, $window, logger) {
        logger = logger.forSource(factoryId);

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

        $delegate.updateAnonymousChanges = updateAnonymousChanges;
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

                    // Raise logged in event
                    $rootScope.$broadcast('userLoggedIn');
                });
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
                    currentUser = dataContext.createEntity('User', {});
                    deferred.resolve(currentUser);
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

        function updateAnonymousChanges(newUser) {
            dataContext.updateAnonymousChanges(newUser);
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?

        function updateElementMultiplier(element, updateType) {

            // Find user element cell
            for (var itemIndex = 0; itemIndex < element.ElementItemSet.length; itemIndex++) {

                var item = element.ElementItemSet[itemIndex];

                var multiplierCell;
                for (var cellIndex = 0; cellIndex < item.ElementCellSet.length; cellIndex++) {
                    var elementCell = item.ElementCellSet[cellIndex];
                    if (elementCell.ElementField.DataType === 12) {
                        multiplierCell = elementCell;
                        break;
                    }
                }

                updateElementCellMultiplier(multiplierCell, updateType);
            }

            // Update related

            // Update items
            for (var i = 0; i < element.ElementItemSet.length; i++) {
                var item = element.ElementItemSet[i];
                item.setMultiplier();
            }

            for (var i = 0; i < element.ElementFieldSet.length; i++) {
                var field = element.ElementFieldSet[i];

                if (!field.IndexEnabled) {
                    continue;
                }

                // Update numeric value cells
                for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {

                    var cell = field.ElementCellSet[cellIndex];
                    cell.setNumericValueMultiplied(false);
                }

                // Update fields
                field.setNumericValueMultiplied();
            }
        }

        function updateElementCellMultiplier(elementCell, updateType) {

            var userCell = elementCell.currentUserCell();

            if (userCell !== null
                && typeof userCell.entityAspect !== 'undefined'
                && userCell.entityAspect.entityState.isDetached()) {
                userCell = null;
            }

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userCell === null) {

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: 1
                        });

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 1
                        if (userCell.entityAspect.entityState.isDeleted()) {
                            userCell.entityAspect.rejectChanges();
                            userCell.DecimalValue = 1;
                        } else { // Otherwise, go ahead!
                            userCell.DecimalValue++;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is an item, decrease
                    if (userCell !== null) {
                        userCell.DecimalValue = userCell.DecimalValue - 1 < 0 ? 0 : userCell.DecimalValue - 1;
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userCell !== null && !userCell.entityAspect.entityState.isDeleted()) {
                        userCell.DecimalValue = 0;
                        userCell.entityAspect.setDeleted();
                    }

                    break;
                }
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            var userCell = elementCell.currentUserCell();

            if (userCell !== null
                && typeof userCell.entityAspect !== 'undefined'
                && userCell.entityAspect.entityState.isDetached()) {
                userCell = null;
            }

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userCell === null) {

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: 55
                        });

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 5
                        if (typeof userCell.entityAspect != 'undefined'
                            && userCell.entityAspect.entityState.isDeleted()) {
                            userCell.entityAspect.rejectChanges();
                            userCell.DecimalValue = 55;
                        } else { // Otherwise, go ahead!
                            userCell.DecimalValue = userCell.DecimalValue + 5 > 100
                                ? 100
                                : userCell.DecimalValue + 5;
                        }

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create it
                    if (userCell === null) {

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: 45
                        });

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default - 5
                        if (userCell.entityAspect.entityState.isDeleted()) {
                            userCell.entityAspect.rejectChanges();
                            userCell.DecimalValue = 45;
                        } else { // Otherwise, go ahead!
                            userCell.DecimalValue = userCell.DecimalValue - 5 < 0 ? 0 : userCell.DecimalValue - 5;
                        }

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userCell !== null && !userCell.entityAspect.entityState.isDeleted()) {
                        userCell.DecimalValue = 50;
                        userCell.entityAspect.setDeleted();

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
            }
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = elementField.currentUserElementField();

            if (userElementField !== null
                && typeof userElementField.entityAspect !== 'undefined'
                && userElementField.entityAspect.entityState.isDetached()) {
                userElementField = null;
            }

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

                        // Update related
                        elementField.setCurrentUserIndexRating();

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 5
                        if (userElementField.entityAspect.entityState.isDeleted()) {
                            userElementField.entityAspect.rejectChanges();
                            userElementField.Rating = 55;
                        } else { // Otherwise, go ahead!
                            userElementField.Rating = userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5;
                        }

                        // Update related
                        elementField.setCurrentUserIndexRating();
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

                        // Update related
                        elementField.setCurrentUserIndexRating();

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default - 5
                        if (userElementField.entityAspect.entityState.isDeleted()) {
                            userElementField.entityAspect.rejectChanges();
                            userElementField.Rating = 45;
                        } else { // Otherwise, go ahead!
                            userElementField.Rating = userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                        }

                        elementField.setCurrentUserIndexRating();
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userElementField !== null && !userElementField.entityAspect.entityState.isDeleted()) {
                        userElementField.Rating = 50;
                        userElementField.entityAspect.setDeleted();

                        elementField.setCurrentUserIndexRating();
                    }

                    break;
                }
            }
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = resourcePool.currentUserResourcePool();

            if (userResourcePool !== null
                && typeof userResourcePool.entityAspect !== 'undefined'
                && userResourcePool.entityAspect.entityState.isDetached()) {
                userResourcePool = null;
            }

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

                        // Update related
                        resourcePool.setCurrentUserResourcePoolRate();

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to 15
                        if (userResourcePool.entityAspect.entityState.isDeleted()) {
                            userResourcePool.entityAspect.rejectChanges();
                            userResourcePool.ResourcePoolRate = 15;
                        } else { // Otherwise, go ahead!
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5;
                        }

                        // Update related
                        resourcePool.setCurrentUserResourcePoolRate();
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

                        // Update related
                        resourcePool.setCurrentUserResourcePoolRate();

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to 5
                        if (userResourcePool.entityAspect.entityState.isDeleted()) {
                            userResourcePool.entityAspect.rejectChanges();
                            userResourcePool.ResourcePoolRate = 5;
                        } else { // Otherwise, go ahead!
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;
                        }

                        // Update related
                        resourcePool.setCurrentUserResourcePoolRate();
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userResourcePool !== null && !userResourcePool.entityAspect.entityState.isDeleted()) {
                        userResourcePool.ResourcePoolRate = 10;
                        userResourcePool.entityAspect.setDeleted();

                        // Update related
                        resourcePool.setCurrentUserResourcePoolRate();
                    }

                    break;
                }
            }
        }
    }

})();
