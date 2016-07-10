/*
 * Authorization interceptors for angular & OData
 */

module Main.Config {
    'use strict';

    var angularInterceptorId = 'AngularInterceptor';

    angular.module('main')
        .config(['$httpProvider', authorizationConfig])
        .run(['logger', '$window', authorizationRun])
        .factory(angularInterceptorId, ['logger', '$q', '$window', angularInterceptor]);

    function authorizationConfig($httpProvider: ng.IHttpProvider) {
        $httpProvider.interceptors.push(angularInterceptorId);
    }

    function authorizationRun(logger, $window) {

        // Logger
        logger = logger.forSource('authorizationRun');

        // OData interceptor
        var oldClient = $window.OData.defaultHttpClient;
        var newClient = {
            request(request, success, error) {
                request.headers = request.headers || {};
                var token = angular.fromJson($window.localStorage.getItem('token'));
                request.headers.Authorization = token !== null ? 'Bearer ' + token.access_token : '';
                return oldClient.request(request, success, error);
            }
        };
        $window.OData.defaultHttpClient = newClient;
    }

    function angularInterceptor(logger, $q, $window) {

        // Logger
        logger = logger.forSource(angularInterceptorId);

        return {
            request(config) {
                config.headers = config.headers || {};
                var token = angular.fromJson($window.localStorage.getItem('token'));
                config.headers.Authorization = token !== null ? 'Bearer ' + token.access_token : '';
                return config;
            },
            response(response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        };
    }
}
