
(function () {
    'use strict';

    angular.module('main').config(function ($provide) {
        $provide.decorator('userService', function ($delegate) {
            $delegate.getUserResourcePoolSet = getUserResourcePoolSet;
            return $delegate;
        });
    });

    function getUserResourcePoolSet(resourcePoolId, userService, logger) {

        logger.logSuccess('getUserResourcePoolSet', null, true);

        var query = breeze.EntityQuery
            .from("UserResourcePool")
            .expand("ResourcePool")
            .where("UserId eq 1 and ResourcePoolId eq " + resourcePoolId)
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

        return userService.getDataContext().manager.executeQuery(query)
            .then(success).catch(failed);

        function success(response) {
            var count = response.results.length;
            logger.logSuccess('Got ' + count + ' user(s)', response, true);
            return response.results;
        }

        function failed(error) {
            var message = error.message || "User query failed";
            logger.logError(message, error, true);
        }
    }
})();
