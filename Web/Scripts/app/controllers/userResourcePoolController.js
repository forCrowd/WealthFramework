(function () {
    'use strict';

    var controllerId = 'userResourcePoolController';
    angular.module('main')
        .controller(controllerId, ['userResourcePoolService', '$location', 'logger', userResourcePoolController]);

    function userResourcePoolController(userResourcePoolService, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.userResourcePool = null;
        vm.increaseNumberOfSales = increaseNumberOfSales;
        vm.resetNumberOfSales = resetNumberOfSales;

        initialize();

        function initialize() {
            getUserResourcePool();
        };

        function getUserResourcePool() {

            logger.logSuccess('location', $location, true);

            var resourcePoolId = 0;

            logger.logSuccess('resourcePoolId : ' + resourcePoolId, null, true);
            
            switch ($location.path())
            {
                case '/TotalCostIndex/': resourcePoolId = 1; break;
                case '/KnowledgeIndex/': resourcePoolId = 2; break;
                case '/QualityIndex/': resourcePoolId = 3; break;
                case '/EmployeeSatisfactionIndex/': resourcePoolId = 4; break;
                case '/CustomerSatisfactionIndex/': resourcePoolId = 5; break;
                case '/SectorIndex/': resourcePoolId = 6; break;
                case '/DistanceIndex/': resourcePoolId = 7; break;
                case '/AllInOne/': resourcePoolId = 8; break;
            }

            logger.logSuccess('resourcePoolId : ' + resourcePoolId, null, true);

            return userResourcePoolService.getUserResourcePool(resourcePoolId)
                .then(function (data) {
                    return vm.userResourcePool = data;
                });
        }

        function increaseNumberOfSales() {
            userResourcePoolService.increaseNumberOfSales(vm.userResourcePool.Id)
                .success(function () {
                    getUserResourcePool();
                });
        }

        function resetNumberOfSales() {
            userResourcePoolService.resetNumberOfSales(vm.userResourcePool.Id)
                .success(function () {
                    getUserResourcePool();
                });
        }
    };
})();
