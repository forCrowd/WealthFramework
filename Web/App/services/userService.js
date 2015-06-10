
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

        var user = null;
        var getUserPromise = null;

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
                    getUserPromise = null;

                    // Clear breeze's metadata store
                    if (resetDataContext) {
                        dataContext.clear();
                    }

                    // Get current user
                    getCurrentUser()
                        .then(function (user) {

                            // Raise logged in event
                            $rootScope.$broadcast('userLoggedIn');

                        });
                })
        }

        function getCurrentUser() {

            var deferred = $q.defer();

            if (getUserPromise === null) {
                getUserPromise = deferred.promise;

                var query = breeze.EntityQuery
                    .from('Users')
                    .using(breeze.FetchStrategy.FromServer);

                dataContext.executeQuery(query)
                    .then(success)
                    .catch(failed);
            }

            return getUserPromise;

            function success(response) {

                if (response.results.length > 0) {
                    user = response.results[0];
                    deferred.resolve(user);

                } else {
                    dataContext.createEntity('User', {})
                            .then(function (newUser) {
                                user = newUser;
                                deferred.resolve(user);
                            })
                    .catch(function () {
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
            return user !== null && user.Id > 0;
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .success(function (newUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    user.Id = newUser.Id;
                    user.Email = newUser.Email;
                    user.UserName = newUser.UserName;
                    user.entityAspect.acceptChanges();

                })
                .error(function (data, status, headers, config) {

                    // TODO
                    //logger.logError('Error!', { data: data, status: status, headers: headers, config: config });
                    if (typeof data.ModelState !== 'undefined') {
                        var modelErrors = Object.keys(data.ModelState);
                        logger.logError(data.ModelState[modelErrors], data.ModelState[modelErrors]);
                    }
                });
        }

        function logout() {
            return $http.post(logoutUrl)
                .success(function () {

                    // Remove access token from the session
                    $window.localStorage.removeItem('access_token');

                    // Clear user promise
                    getUserPromise = null;

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
                        logger.logError(data.ModelState[modelErrors], data.ModelState[modelErrors]);
                    }
                });
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?

        function updateElementMultiplier(element, updateType) {

            // Find user element cell
            for (var i = 0; i < element.ElementItemSet.length; i++) {

                var elementCell = element.ElementItemSet[i].multiplierCell();
                var userCell = elementCell.userCell();

                switch (updateType) {
                    case 'increase': {

                        // If there is no item, create it
                        if (userCell === null) {
                            userCell = {
                                User: user,
                                ElementCell: elementCell,
                                DecimalValue: 1
                            };

                            dataContext.createEntity('UserElementCell', userCell);

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

                // Broadcast the update
                if (userCell !== null) {
                    $rootScope.$broadcast('elementMultiplierUpdated', { elementCell: elementCell, value: userCell.DecimalValue });
                }
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            var userCell = elementCell.userCell();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userCell === null) {
                        userCell = {
                            User: user,
                            ElementCell: elementCell,
                            DecimalValue: 55
                        };

                        dataContext.createEntity('UserElementCell', userCell);

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default + 5
                        if (userCell.entityAspect.entityState.isDeleted()) {
                            userCell.entityAspect.rejectChanges();
                            userCell.DecimalValue = 55;
                        } else { // Otherwise, go ahead!
                            userCell.DecimalValue = userCell.DecimalValue + 5 > 100 ? 100 : userCell.DecimalValue + 5;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create it
                    if (userCell === null) {
                        userCell = {
                            User: user,
                            ElementCell: elementCell,
                            DecimalValue: 45
                        };

                        dataContext.createEntity('UserElementCell', userCell);

                    } else {

                        // If it's marked as deleted, cancel that deletion and set it to default - 5
                        if (userCell.entityAspect.entityState.isDeleted()) {
                            userCell.entityAspect.rejectChanges();
                            userCell.DecimalValue = 45;
                        } else { // Otherwise, go ahead!
                            userCell.DecimalValue = userCell.DecimalValue - 5 < 0 ? 0 : userCell.DecimalValue - 5;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item and not marked as deleted, delete it
                    if (userCell !== null && !userCell.entityAspect.entityState.isDeleted()) {
                        userCell.DecimalValue = 50;
                        userCell.entityAspect.setDeleted();
                    }

                    break;
                }
            }

            // Broadcast the update
            if (userCell !== null) {
                $rootScope.$broadcast('elementCellNumericValueUpdated', { elementCell: elementCell, value: userCell.DecimalValue });
            }
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = elementField.userElementField();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            User: user,
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
                            User: user,
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
                $rootScope.$broadcast('elementMultiplierUpdated', { elementField: elementField, value: userElementField.Rating });
            }
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = resourcePool.userResourcePool();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            User: user,
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
                            User: user,
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
