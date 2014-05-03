
(function () {
    'use strict';

    var serviceId = 'userService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', 'logger', userService]);
        });

    function userService($delegate, dataContext, $http, $q, $rootScope, logger) {
        logger = logger.forSource(serviceId);

        var accessTokenUrl = '/api/Token';
        var userInfo = null;
        var userInfoUrl = '/api/Account/UserInfo';

        // Service methods
        $delegate.getAccessToken = getAccessToken;
        $delegate.getUserInfo = getUserInfo;
        $delegate.logout = logout;
        $delegate.register = register;

        return $delegate;

        /*** Implementations ***/

        function getAccessToken(email, password) {
            var accessTokenData = 'grant_type=password&username=' + email + '&password=' + password;

            return $http.post(accessTokenUrl, accessTokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (data) {
                    $rootScope.$broadcast('userLoggedIn');

                    // TODO in case cookies are disabled?

                })
                .error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function getUserInfo() {

            var deferred = $q.defer();

            if (userInfo !== null) {
                deferred.resolve(userInfo);
            } else {
                $http.get(userInfoUrl)
                    .success(function (data) {
                        userInfo = data;
                        deferred.resolve(userInfo);
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
                    $rootScope.$broadcast('userLoggedOut');
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
