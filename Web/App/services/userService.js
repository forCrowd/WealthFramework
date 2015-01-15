
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
        var resetSampleDataUrl = '/api/Account/ResetSampleData';
        var userInfo = null;
        var userInfoUrl = '/api/Account/UserInfo';

        // Service methods
        $delegate.changePassword = changePassword;
        $delegate.getAccessToken = getAccessToken;
        $delegate.getUserInfo = getUserInfo;
        $delegate.logout = logout;
        $delegate.register = register;
        $delegate.resetSampleData = resetSampleData;

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

                    // Raise logged in event
                    $rootScope.$broadcast('userLoggedIn');
                })
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
                        // If it returns Unauthorized (status === 401), then it's not logged in yet and it's okay, no need to show an error
                        // It's something else, server may not be unreachle or internal error? Just say 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });
            }

            return deferred.promise;
        }

        function logout() {
            return $http.post(logoutUrl)
                .success(function () {

                    // Remove access token from the session
                    $window.localStorage.removeItem('access_token');

                    // Clear userInfo
                    userInfo = null;

                    // Clear breeze's metadata store
                    dataContext.initializeStore();

                    // Raise logged outevent
                    $rootScope.$broadcast('userLoggedOut');
                })
                .error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function resetSampleData() {
            return $http.post(resetSampleDataUrl)
                .error(function (data, status, headers, config) {
                    // TODO ?
                });
        }
    }

})();
