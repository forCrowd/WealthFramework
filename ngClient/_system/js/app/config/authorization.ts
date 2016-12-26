import * as angular from "angular";

export function authorizationConfig($httpProvider: ng.IHttpProvider) {
    $httpProvider.interceptors.push("angularInterceptor");
}

export function authorizationRun(logger: any, $window: any) {

    // OData interceptor
    var oldClient = $window.OData.defaultHttpClient;
    var newClient = {
        request(request, success, error) {
            request.headers = request.headers || {};
            var token = angular.fromJson($window.localStorage.getItem("token"));
            request.headers.Authorization = token !== null ? "Bearer " + token.access_token : "";
            return oldClient.request(request, success, error);
        }
    };
    $window.OData.defaultHttpClient = newClient;
}

export function angularInterceptor(logger: any, $q: any, $window: any) {

    return {
        request(config) {
            config.headers = config.headers || {};
            var token = angular.fromJson($window.localStorage.getItem("token"));
            config.headers.Authorization = token !== null ? "Bearer " + token.access_token : "";
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
