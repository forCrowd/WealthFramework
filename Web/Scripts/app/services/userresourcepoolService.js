
(function () {
    'use strict';

    var serviceId = 'userResourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', 'logger', userResourcePoolService]);
        });

    function userResourcePoolService($delegate, dataContext, $http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods (alphabetically)
        $delegate.getUserResourcePool = getUserResourcePool;
        $delegate.increaseNumberOfSales = increaseNumberOfSales;
        $delegate.resetNumberOfSales = resetNumberOfSales;

        return $delegate;

        /*** Implementations ***/

        function getUserResourcePool(userId, resourcePoolId) {

            var query = breeze.EntityQuery
                .from("UserResourcePool")
                .expand("ResourcePool")
                .where("UserId eq " + userId + " and ResourcePoolId eq " + resourcePoolId)
            ;

            // Fetch the data from server, in case if it's not fetched earlier or forced
            // var fetchFromServer = fetchedOn === minimumDate || forceRefresh;
            var fetchFromServer = true;

            // Prepare the query
            if (fetchFromServer) { // From remote
                query = query.using(breeze.FetchStrategy.FromServer)
                //fetchedOn = new Date();
            }
            else { // From local
                query = query.using(breeze.FetchStrategy.FromLocalCache)
            }

            return dataContext.manager.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                var count = response.results.length;
                logger.logSuccess('Got ' + count + ' user resource pool(s)', response, true);
                return response.results[0];
            }

            function failed(error) {
                var message = error.message || "User query failed";
                logger.logError(message, error, true);
            }
        }

        function increaseNumberOfSales(userResourcePoolId) {

            var url = '/odata/UserResourcePool(' + userResourcePoolId + ')/IncreaseNumberOfSales';

            return $http({ method: 'POST', url: url }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function resetNumberOfSales(userResourcePoolId) {

            var url = '/odata/UserResourcePool(' + userResourcePoolId + ')/ResetNumberOfSales';

            return $http({ method: 'POST', url: url }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }
    }

})();
