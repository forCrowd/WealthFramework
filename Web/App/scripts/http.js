(function () {
    'use strict';

    angular.module('main')
        .run(httpConfig);

    //var serviceId = 'httpService';
    //angular.module('main')
    //    .factory(serviceId, ['$http', 'logger', httpService]);

    function httpConfig($http, $window) {

        $window.console.log('ng http config');

        setWebApi();

        setOData();

        //// Get the token
        //var access_token = $window.sessionStorage.getItem('access_token');
        
        //// Web Api
        //if (access_token !== null) {
        //    $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
        //}

        //// OData
        //var oldClient = OData.defaultHttpClient;
        //var myClient = {
        //    request: function (request, success, error) {

        //        $window.console.log('OData httpclient request begin');

        //        $window.console.log('OData httpclient request access_token: ' + access_token);

        //        if (access_token === null) {
        //            $window.console.log('OData httpclient request NO');
        //            delete request.headers.Authorization;
        //        } else {
        //            $window.console.log('OData httpclient request YES');
        //            request.headers.Authorization = 'Bearer ' + access_token;
        //        }

        //        $window.console.log('OData httpclient request end');

        //        return oldClient.request(request, success, error);
        //    }
        //};
        //OData.defaultHttpClient = myClient;

        //$window.console.log('OData httpclient run');
        //// OData.defaultHttpClient.request.headers.Authorization = 'Bearer ' + access_token;

    }

    function setWebApi() {
        // Get the token
        var access_token = window.sessionStorage.getItem('access_token');

        // Web Api
        if (access_token !== null) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
        }
    }

    function setOData() {

        // OData
        var oldClient = OData.defaultHttpClient;
        var myClient = {
            request: function (request, success, error) {

                window.console.log('OData httpclient request begin');

                // Get the token
                var access_token = window.sessionStorage.getItem('access_token');

                window.console.log('OData httpclient request access_token: ' + access_token);

                if (access_token === null) {
                    window.console.log('OData httpclient request NO');
                    delete request.headers.Authorization;
                } else {
                    window.console.log('OData httpclient request YES');
                    request.headers.Authorization = 'Bearer ' + access_token;
                }

                window.console.log('OData httpclient request end');

                return oldClient.request(request, success, error);
            }
        };

        OData.defaultHttpClient = myClient;

        window.console.log('OData httpclient run');
    }

    //function httpService($http, logger) {
    //    logger = logger.forSource(serviceId);

    //    // Service methods
    //    var service = {
    //        setToken: setToken,
    //        configureHttpClients: configureHttpClients,
    //        removeToken: removeToken
    //    };

    //    return service;

    //    /*** Implementations ***/

    //    function setToken(accessToken) {



    //    }

    //    function configureHttpClients() {

    //        // Web Api token
    //        var access_token = $window.sessionStorage.getItem('access_token');
    //        if (access_token !== null) {

    //            $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;

    //            // OData authentication
    //            var oldClient = OData.defaultHttpClient;
    //            var myClient = {
    //                request: function (request, success, error) {
    //                    $window.console.log('OData httpclient run');
    //                    request.headers.Authorization = 'Bearer ' + access_token;
    //                    return oldClient.request(request, success, error);
    //                }
    //            };
    //            OData.defaultHttpClient = myClient;

    //        }

    //        function removeToken() {

    //        }
    //    }
    //}

})();
