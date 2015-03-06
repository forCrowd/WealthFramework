
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, dataContext, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getResourcePoolExpanded = getResourcePoolExpanded;

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolExpanded(resourcePoolId) {

            var query = breeze.EntityQuery
                .from('ResourcePool')
                .expand('UserResourcePoolSet, ElementSet.ElementFieldSet.ElementFieldIndexSet.UserElementFieldIndexSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet')
                .where('Id', 'eq', resourcePoolId)
                //.orderBy('ElementFieldSet.SortOrder')
            ;

            query = query.using(breeze.FetchStrategy.FromServer);

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                var count = response.results.length;
                //logger.logSuccess('Got ' + count + ' resourcePool(s)', response, true);
                return response.results;
            }

            function failed(error) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error);
            }
        }
    }
})();
