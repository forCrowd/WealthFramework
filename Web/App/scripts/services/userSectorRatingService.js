
//(function () {
//    'use strict';

//    var serviceId = 'userSectorRatingService';
//    angular.module('main')
//        .config(function ($provide) {
//            $provide.decorator(serviceId, ['$delegate', 'dataContext', 'logger', userSectorRatingService]);
//        });

//    function userSectorRatingService($delegate, dataContext, logger) {
//        logger = logger.forSource(serviceId);

//        // To determine whether the data will be fecthed from server or local
//        var minimumDate = new Date(0);
//        var fetchedOn = minimumDate;

//        // Service methods
//        $delegate.getUserSectorRatingSetByResourcePoolId = getUserSectorRatingSetByResourcePoolId;

//        return $delegate;

//        /*** Implementations ***/

//        function getUserSectorRatingSetByResourcePoolId(resourcePoolId, forceRefresh) {

//            var query = breeze.EntityQuery
//				.from('UserSectorRating')
//				.expand('Sector')
//                .where('Sector.ResourcePoolId', 'eq', resourcePoolId)
//            ;

//            // Fetch the data from server, in case if it's not fetched earlier or forced
//            var fetchFromServer = fetchedOn === minimumDate || forceRefresh;

//            // Prepare the query
//            if (fetchFromServer) { // From remote
//                query = query.using(breeze.FetchStrategy.FromServer)
//                fetchedOn = new Date();
//            }
//            else { // From local
//                query = query.using(breeze.FetchStrategy.FromLocalCache)
//            }

//            return dataContext.executeQuery(query)
//                .then(success).catch(failed);

//            function success(response) {
//                var count = response.results.length;
//                logger.logSuccess('Got ' + count + ' user sector rating(s)', response, true);
//                return response.results;
//            }

//            function failed(error) {
//                var message = error.message || "User query failed";
//                logger.logError(message, error, true);
//            }
//        }
//    }

//})();
