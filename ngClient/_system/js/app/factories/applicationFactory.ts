//import { LoggerService } from "../ng2/services/logger";

export function applicationFactory(logger: any, settings: any, $http: any, $q: any) {

    var applicationInfoUrl = settings.serviceAppUrl + "/api/Application/ApplicationInfo";
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
                    // TODO Check this approach? - Just return "Something went wrong"?
                    deferred.reject({ data: data, status: status, headers: headers, config: config });
                });
        }

        return deferred.promise;
    }
}
