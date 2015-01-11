/*
 * Authorization interceptors for angular & OData
 * TODO Could be shorter?
 */

(function () {
    'use strict';

    angular.module('main')
        .config(['$httpProvider', authorizationConfig]);

    angular.module('main')
        .run(['$window', 'logger', authorizationRun]);

    var interceptorId = 'angularInterceptor';
    angular.module('main')
        .factory(interceptorId, ['$q', '$window', 'logger', angularInterceptor]);

    function authorizationConfig($httpProvider) {
        $httpProvider.interceptors.push(interceptorId);
    }

    function authorizationRun($window, logger) {
        setODataInterceptor($window, logger);
    }

    // angular
    function angularInterceptor($q, $window, logger) {

        // Logger
        logger = logger.forSource(interceptorId);

        return {
            request: function (config) {
                config.headers = config.headers || {};
                var access_token = $window.sessionStorage.getItem('access_token');
                if (access_token !== null)
                    config.headers.Authorization = 'Bearer ' + access_token;
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        };
    };

    // OData
    function setODataInterceptor($window, logger) {

        // Logger
        logger = logger.forSource('setODataInterceptor');

        var oldClient = $window.OData.defaultHttpClient;
        var newClient = {
            request: function (request, success, error) {
                request.headers = request.headers || {};
                var access_token = $window.sessionStorage.getItem('access_token');
                if (access_token !== null)
                    request.headers.Authorization = 'Bearer ' + access_token;
                return oldClient.request(request, success, error);
            }
        };
        $window.OData.defaultHttpClient = newClient;
    }

})();
