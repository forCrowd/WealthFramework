
(function () {
    'use strict';

    var serviceId = 'userResourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', 'logger', userResourcePoolService]);
        });

    function userResourcePoolService($delegate, $http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getUserResourcePoolByResourcePoolId = getUserResourcePoolByResourcePoolId;
        $delegate.decreaseNumberOfSales = decreaseNumberOfSales;
        $delegate.increaseNumberOfSales = increaseNumberOfSales;
        $delegate.resetNumberOfSales = resetNumberOfSales;

        return $delegate;

        /*** Implementations ***/

        function getUserResourcePoolByResourcePoolId(resourcePoolId) {
            var url = '/api/UserResourcePoolCustom/GetUserResourcePoolByResourcePoolId/' + resourcePoolId;
            return $http.get(url);
        }

        function decreaseNumberOfSales(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/DecreaseNumberOfSales/' + userResourcePoolId;
            return $http.post(url);
        }

        function increaseNumberOfSales(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/IncreaseNumberOfSales/' + userResourcePoolId;
            return $http.post(url);
        }

        function resetNumberOfSales(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/ResetNumberOfSales/' + userResourcePoolId;
            return $http.post(url);
        }
    }
})();
