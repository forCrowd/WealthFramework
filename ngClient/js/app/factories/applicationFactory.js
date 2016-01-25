(function () {
    'use strict';

    var factoryId = 'applicationFactory';
    angular.module('main')
        .factory(factoryId, ['$http', '$q', 'serviceAppUrl', 'logger', applicationFactory]);

    function applicationFactory($http, $q, serviceAppUrl, logger) {
        logger = logger.forSource(factoryId);

        var applicationInfoUrl = serviceAppUrl + '/api/Application/ApplicationInfo';
        var applicationInfo = null;

        // Factory methods
        var factory = {
            getApplicationInfo: getApplicationInfo
        };

        return factory;

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
