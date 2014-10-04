
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
        $delegate.getUserResourcePool = getUserResourcePool;
        $delegate.decreaseNumberOfSales = decreaseNumberOfSales;
        $delegate.decreaseResourcePoolRate = decreaseResourcePoolRate;
        $delegate.increaseNumberOfSales = increaseNumberOfSales;
        $delegate.increaseResourcePoolRate = increaseResourcePoolRate;
        $delegate.resetNumberOfSales = resetNumberOfSales;

        return $delegate;

        /*** Implementations ***/

        function getUserResourcePool(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/GetUserResourcePool/' + userResourcePoolId;
            return $http.get(url);
        }

        function decreaseNumberOfSales(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/DecreaseNumberOfSales/' + userResourcePoolId;
            return $http.post(url);
        }

        function decreaseResourcePoolRate(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/DecreaseResourcePoolRate/' + userResourcePoolId;
            return $http.post(url);
        }

        function increaseNumberOfSales(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/IncreaseNumberOfSales/' + userResourcePoolId;
            return $http.post(url);
        }

        function increaseResourcePoolRate(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/IncreaseResourcePoolRate/' + userResourcePoolId;
            return $http.post(url);
        }

        function resetNumberOfSales(userResourcePoolId) {
            var url = '/api/UserResourcePoolCustom/ResetNumberOfSales/' + userResourcePoolId;
            return $http.post(url);
        }
    }
})();
