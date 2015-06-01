
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
        var userInfoUrl = '/api/Account/UserInfo';
        var userInfo = null;
        var userInfoFetched = false;

        // Service methods
        $delegate.changePassword = changePassword;
        $delegate.getAccessToken = getAccessToken;
        $delegate.getUserInfo = getUserInfo;
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

        function getAccessToken(email, password) {
            var accessTokenData = 'grant_type=password&username=' + email + '&password=' + password;

            return $http.post(accessTokenUrl, accessTokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (data) {

                    // Set access token to the session
                    $window.localStorage.setItem('access_token', data.access_token);

                    // Clear userInfo
                    userInfo = null;
                    userInfoFetched = false;

                    // Get the updated userInfo
                    getUserInfo()
                        .then(function () {

                            // Raise logged in event
                            $rootScope.$broadcast('userLoggedIn');

                        });
                })
        }

        function getUserInfo() {
            var deferred = $q.defer();

            if (userInfoFetched) {
                deferred.resolve(userInfo);

            } else {
                $http.get(userInfoUrl)
                    .success(function (data) {
                        // A temp fix for WebApi returns 'null' (as string), instead of null
                        // TODO Find a permanent fix!
                        if (data === 'null') {
                            data = null;
                        }

                        userInfo = data;

                        deferred.resolve(userInfo);
                    })
                    .error(function (data, status, headers, config) {
                        userInfo = null;

                        // TODO
                        // If it returns Unauthorized (status === 401), then it's not logged in yet and it's okay, no need to show an error
                        // It's something else, server may not be unreachle or internal error? Just say 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    })
                    .finally(function () {
                        userInfoFetched = true;

                    });
            }

            return deferred.promise;
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
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

                    // Clear userInfo
                    userInfo = null;
                    userInfoFetched = false;

                    // Clear breeze's metadata store
                    dataContext.clear();

                    // Raise logged outevent
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

            // Validate
            if (element.multiplierField() === null)
                return false;

            // Find user element cell
            for (var i = 0; i < element.ElementItemSet.length; i++) {

                var userCell = element.ElementItemSet[i].multiplierCell().userCell();

                switch (updateType) {
                    case 'increase': {

                        // If there is no item, create it
                        if (userCell === null) {
                            userCell = {
                                UserId: userInfo.Id,
                                ElementCellId: element.ElementItemSet[i].multiplierCell().Id,
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
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            var userCell = elementCell.userCell();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userCell === null) {
                        userCell = {
                            UserId: userInfo.Id,
                            ElementCellId: elementCell.Id,
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
                            UserId: userInfo.Id,
                            ElementCellId: elementCell.Id,
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
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = elementField.userElementField();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            UserId: userInfo.Id,
                            ElementFieldId: elementField.Id,
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
                            UserId: userInfo.Id,
                            ElementFieldId: elementField.Id,
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
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = resourcePool.userResourcePool();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            UserId: userInfo.Id,
                            ResourcePoolId: resourcePool.Id,
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
                            UserId: userInfo.Id,
                            ResourcePoolId: resourcePool.Id,
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
        }
    }

})();
