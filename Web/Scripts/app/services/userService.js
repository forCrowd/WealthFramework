
(function () {
    'use strict';

    var serviceId = 'userService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', '$q', 'logger', userService]);
        });

    function userService($delegate, dataContext, $http, $q, logger) {
        logger = logger.forSource(serviceId);

        var accessTokenUrl = '/api/Token';
        var currentUser = null;
        var currentUserUrl = '/api/Account/UserInfo';

        // Service methods
        $delegate.getAccessToken = getAccessToken;
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.logout = logout;
        $delegate.register = register;

        return $delegate;

        /*** Implementations ***/

        function getAccessToken(email, password) {
            var accessTokenData = 'grant_type=password&username=' + email + '&password=' + password;

            return $http.post(accessTokenUrl, accessTokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (data) {
                    // TODO in case cookies are disabled?
                })
                .error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function getCurrentUser() {

            var deferred = $q.defer();

            if (currentUser !== null) {
                deferred.resolve(currentUser);
            } else {
                $http.get(currentUserUrl)
                    .success(function (data) {
                        currentUser = data;
                        deferred.resolve(currentUser);
                    })
                    .error(function (data, status, headers, config) {
                        // TODO
                        // If it return Unauthorized (status === 401), then it's not logged in yet and it's okay, no need to show an error
                        // It's something else, server may not be unreachle or internal error? Just say 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });
            }

            return deferred.promise;
        }

        function logout() {
            var logoutUrl = '/api/Account/Logout';

            return $http.post(logoutUrl)
                .success(function () {
                    //
                })
                .error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function register() {
            // TODO
        }
    }

})();
