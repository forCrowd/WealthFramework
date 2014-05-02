(function () {
    'use strict';

    var serviceId = 'mainService';
    angular.module('main')
        .factory(serviceId, ['$http', '$q', 'logger', mainService]);

    function mainService($http, $q, logger) {
        logger = logger.forSource(serviceId);

        var applicationInfoUrl = '/api/Application/GetApplicationInfo';
        var applicationInfo = null;

        // Service methods
        var service = {
            getApplicationInfo: getApplicationInfo
        };

        return service;

        /*** Implementations ***/

        function getApplicationInfo() {

            var deferred = $q.defer();

            if (applicationInfo !== null) {
                deferred.resolve(applicationInfo);
            }
            else {
                $http.get(applicationInfoUrl)
                    .success(function (data) {
                        applicationInfo = data;
                        deferred.resolve(applicationInfo);
                    })
                    .error(function (data, status, headers, config) {
                        // TODO Check this approach? - Just return 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });
            }

            return deferred.promise;
        }
    }
})();
