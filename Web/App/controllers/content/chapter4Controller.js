(function () {
    'use strict';

    var controllerId = 'chapter4Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            'userElementCellService',
            'logger',
            chapter4Controller]);

    function chapter4Controller(resourcePoolService, userElementCellService, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 1;

        var vm = this;
        vm.userResourcePool = null;

        vm.chartConfig = null;
        vm.chartData = null;
        vm.decrease = decrease;
        vm.displayResults = false;
        vm.increase = increase;
        vm.resetChanges = resetChanges;
        vm.resultsChartConfig = null;
        vm.resultsSectorSet = [];
        vm.saveChanges = saveChanges;

        initialize();

        /*** Implementations ***/

        function initialize() {
            configureChart();
            loadChartData();
        }

        function getUserResourcePool() {

            resourcePoolService.getUserResourcePool(resourcePoolId)
                .success(function (userResourcePool) {
                    vm.userResourcePool = userResourcePool;
                });
        }

        function decrease(index) {
            vm.chartData[index].y = vm.chartData[index].y - 5 < 0
                ? 0
                : vm.chartData[index].y - 5;
        }

        function increase(index) {
            vm.chartData[index].y += 5;
        }

        function configureChart() {
            vm.chartConfig = {
                title: {
                    //text: 'Sectors'
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

            vm.resultsChartConfig = {
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

            vm.chartConfig.loading = true;
            vm.resultsChartConfig.loading = true;

            resourcePoolService.getUserResourcePool(resourcePoolId)
                .success(function (userResourcePool) {
                    vm.userResourcePool = userResourcePool;

                    // Convert userSectorRating to chart data
                    vm.chartData = [];

                    userElementCellService.getUserElementCellSetByResourcePoolId(vm.userResourcePool.Id, true)
                        .then(function (userElementCellSet) {

                            for (var userElementCellIndex = 0; userElementCellIndex < userElementCellSet.length; userElementCellIndex++) {

                                var userElementCell = userElementCellSet[userElementCellIndex];

                                var chartDataItem = {
                                    name: userElementCell.ElementCell.ElementItem.Name,
                                    y: userElementCell.Rating
                                };

                                vm.chartData.push(chartDataItem);
                            }

                            vm.chartConfig.series = [{ data: vm.chartData }];
                            vm.chartConfig.loading = false;

                        });

                    // Results
                    vm.resultsSectorSet = [];

                    for (var i = 0; i < vm.userResourcePool.MainElement.ElementItemSet.length; i++) {
                        var chartDataItem = {
                            name: vm.userResourcePool.MainElement.ElementItemSet[i].Name,
                            y: vm.userResourcePool.MainElement.ElementItemSet[i].RatingAverage
                        }
                        vm.resultsSectorSet.push(chartDataItem);
                    }

                    vm.resultsChartConfig.series = [{ data: vm.resultsSectorSet }];
                    vm.resultsChartConfig.loading = false;

                });
        }

        function resetChanges() {
            loadChartData();
        }

        function saveChanges() {

            userElementCellService.getUserElementCellSetByResourcePoolId(vm.userResourcePool.Id, true)
                .then(function (userElementCellSet) {

                    for (var i = 0; i < vm.chartData.length; i++) {
                        var dataItem = userElementCellSet[i];
                        var chartDataItem = vm.chartData[i];

                        if (dataItem.Rating !== chartDataItem.y) {
                            dataItem.Rating = chartDataItem.y;
                        }
                    }

                    userElementCellService.saveChanges()
                        .then(function () {
                            logger.logSuccess('Your changes have been saved!', null, true);

                            vm.displayResults = true;

                            loadChartData();
                        });
                });
        }
    };
})();
