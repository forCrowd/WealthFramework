
(function () {
    'use strict';

    var serviceId = 'userService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', 'logger', userService]);
        });

    function userService($delegate, dataContext, $http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods (alphabetically)
        $delegate.isNew = true;
        $delegate.currentUser = null;
        $delegate.currentToken = '';
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.getCurrentUserNew = getCurrentUserNew;
        $delegate.getToken = getToken;
        $delegate.login = login;
        $delegate.logout = logout;
        $delegate.logoutNew = logoutNew;
        $delegate.register = register;

        return $delegate;

        /*** Implementations ***/

        function getCurrentUser() {
            var url = '/api/UserHelper/CurrentUser';

            return $http({
                method: 'GET',
                url: url
            }).
                //success(function (currentUser) {
                //}).
                error(function (data, status, headers, config) {
                    logger.logError('error', null, true);
                });
        }

        function getCurrentUserNew() {
            var url = '/api/Account/UserInfo';

            return $http({
                method: 'GET',
                url: url
            }).
                success(function (currentUser) {
                    $delegate.currentUser = currentUser;
                }).
                error(function (data, status, headers, config) {
                    logger.logError('error', null, true);
                });
        }

        function getToken(email, password) {
            var url = '/api/Token';
            var tokenRequestData = 'grant_type=password&username=' + email + '&password=' + password;

            return $http({
                method: 'POST',
                url: url,
                data: tokenRequestData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).
                success(function (response) {
                    $delegate.isNew = false;
                    logger.logSuccess('userService - isNew', $delegate.isNew, true);
                    $delegate.currentToken = response.access_token;
                }).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function login(email, password) {
            var url = '/api/UserHelper/Login';
            var userDto = { "email": email, "password": password };

            return $http({
                method: 'POST',
                url: url,
                data: userDto,
                headers: { 'Content-Type': 'application/json' }
            }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function logout() {

            var url = '/api/UserHelper/Logout';

            return $http({ method: 'POST', url: url }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function logoutNew() {

            logger.logSuccess('arrived', null, true);

            var url = '/api/Account/Logout';

            var currentToken = userService.currentToken;

            return $http({
                method: 'POST', url: url
            }).
                success(function () {
                    $delegate.currentToken = '';
                }).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function register() {
            // TODO
        }
    }

})();
