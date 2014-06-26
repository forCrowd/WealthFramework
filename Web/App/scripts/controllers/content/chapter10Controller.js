(function () {
    'use strict';

    var controllerId = 'chapter10Controller';
    angular.module('main')
        .controller(controllerId, ['userResourcePoolService', 'resourcePoolService', 'logger', chapter10Controller]);

    function chapter10Controller(userResourcePoolService, resourcePoolService, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 8;

        var vm = this;
        vm.allInOneUserResourcePool = null;
        vm.allInOneResourcePool = null;
        vm.indexChartConfig = null;
        vm.indexChartData = [];
        vm.indexResultsChartData = [];
        vm.decrease = decrease;
        vm.displayResults = false;
        vm.increase = increase;
        vm.resetChanges = resetChanges;
        vm.indexResultsChartConfig = null;
        vm.saveChanges = saveChanges;

        initialize();

        /* Implementations */

        function initialize() {
            configureChart();
            loadChartData();
        }

        function decrease(index) {
            vm.indexChartData[index].y = vm.indexChartData[index].y - 5 < 0
                ? 0
                : vm.indexChartData[index].y - 5;
        }

        function increase(index) {
            vm.indexChartData[index].y += 5;
        }

        function configureChart() {
            vm.indexChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'pie'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true
                        }
                    }
                }
            };

            vm.indexResultsChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'pie'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true
                        }
                    }
                }
            };
        }

        function loadChartData() {

            vm.indexChartConfig.loading = true;

            userResourcePoolService.getUserResourcePoolDtoByResourcePoolId(resourcePoolId, false)
                .success(function (userResourcePool) {

                    // Original data
                    vm.allInOneUserResourcePool = userResourcePool;

                    // Convert userResourcePool to chart data
                    vm.indexChartData = [];
                    vm.indexChartData.push({ name: 'Sector Index', y: userResourcePool.SectorIndexRating });
                    vm.indexChartData.push({ name: 'Knowledge Index', y: userResourcePool.KnowledgeIndexRating });
                    vm.indexChartData.push({ name: 'Total Cost Index', y: userResourcePool.TotalCostIndexRating });
                    vm.indexChartData.push({ name: 'Quality Index', y: userResourcePool.QualityIndexRating });
                    vm.indexChartData.push({ name: 'Employee Satisfaction Index', y: userResourcePool.EmployeeSatisfactionIndexRating });
                    vm.indexChartData.push({ name: 'Customer Satisfaction Index', y: userResourcePool.CustomerSatisfactionIndexRating });

                    vm.indexChartConfig.series = [{ data: vm.indexChartData }];
                    vm.indexChartConfig.loading = false;
                });

            // Results chart
            vm.indexResultsChartConfig.loading = true;

            resourcePoolService.getResourcePoolViewModel(resourcePoolId)
                .success(function (resourcePoolViewModel) {

                    vm.allInOneResourcePool = resourcePoolViewModel;

                    // Convert resourcePoolViewModel to chart data
                    vm.indexResultsChartData = [];
                    vm.indexResultsChartData.push({ name: 'Sector Index', y: resourcePoolViewModel.SectorIndexRatingAverage });
                    vm.indexResultsChartData.push({ name: 'Knowledge Index', y: resourcePoolViewModel.KnowledgeIndexRatingAverage });
                    vm.indexResultsChartData.push({ name: 'Total Cost Index', y: resourcePoolViewModel.TotalCostIndexRatingAverage });
                    vm.indexResultsChartData.push({ name: 'Quality Index', y: resourcePoolViewModel.QualityIndexRatingAverage });
                    vm.indexResultsChartData.push({ name: 'Employee Satisfaction Index', y: resourcePoolViewModel.EmployeeSatisfactionIndexRatingAverage });
                    vm.indexResultsChartData.push({ name: 'Customer Satisfaction Index', y: resourcePoolViewModel.CustomerSatisfactionIndexRatingAverage });

                    vm.indexResultsChartConfig.series = [{ data: vm.indexResultsChartData }];
                    vm.indexResultsChartConfig.loading = false;

                });
        }

        function resetChanges() {
            loadChartData();
        }

        function saveChanges() {

            userResourcePoolService.getUserResourcePool(vm.allInOneUserResourcePool.Id, false)
                .then(function (userResourcePool) {

                    userResourcePool.TotalCostIndexRating = vm.indexChartData[0].y;
                    userResourcePool.KnowledgeIndexRating = vm.indexChartData[1].y;
                    userResourcePool.QualityIndexRating = vm.indexChartData[2].y;
                    userResourcePool.SectorIndexRating = vm.indexChartData[3].y;
                    userResourcePool.EmployeeSatisfactionIndexRating = vm.indexChartData[4].y;
                    userResourcePool.CustomerSatisfactionIndexRating = vm.indexChartData[5].y;

                    var rowVersion = userResourcePool.RowVersion;
                    userResourcePool.RowVersion = '';
                    userResourcePool.RowVersion = rowVersion;

                    userResourcePoolService.saveChanges()
                        .then(function () {
                            logger.logSuccess('Your changes have been saved!', null, true);

                            vm.displayResults = true;

                            loadChartData();
                        });
                });
        }
    };
})();
