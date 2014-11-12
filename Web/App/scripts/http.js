(function () {
    'use strict';

    angular.module('main')
        .run(['$http', '$window', 'logger', httpConfig]);

    /* Sets Authorization headers of both angular's http and datajs's OData
     * by checking whether the current session has an access code or not
     */
    function httpConfig($http, $window, logger) {

        // Logger
        logger = logger.forSource('httpConfig');

        // Configure
        setWebApi();
        setOData();

        function setWebApi() {
            $http.defaults.headers.common.Authorization = getAuthorizationHeader; // Use the function itself
        }

        function setOData() {
            var oldClient = $window.OData.defaultHttpClient;
            var newClient = {
                request: function (request, success, error) {
                    request.headers.Authorization = getAuthorizationHeader(); // Use the function result
                    return oldClient.request(request, success, error);
                }
            };
            $window.OData.defaultHttpClient = newClient;
        }

        function getAuthorizationHeader() {
            var access_token = $window.sessionStorage.getItem('access_token');
            return access_token !== null
                ? 'Bearer ' + access_token
                : 'None'; // TODO Remove the authorization header instead?
        }
    }

})();
