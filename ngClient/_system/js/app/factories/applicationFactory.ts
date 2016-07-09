module Main.Factories {
    'use strict';

    var factoryId = 'applicationFactory';

    export function applicationFactory(logger: any, serviceAppUrl: any, $http: any, $q: any) {
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
                    .success(data => {
                        applicationInfo = data;
                        deferred.resolve(applicationInfo);
                    })
                    .error((data, status, headers, config) => {
                        // TODO Check this approach? - Just return 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });
            }

            return deferred.promise;
        }
    }

    applicationFactory.$inject = ['logger', 'serviceAppUrl', '$http', '$q'];

    angular.module('main').factory(factoryId, applicationFactory);
}