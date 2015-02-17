(function () {
    'use strict';

    var controllerId = 'chapter6Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userElementCellService', 'logger', chapter6Controller]);

    function chapter6Controller(resourcePoolService, userElementCellService, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 3;

        //var refreshTimeout = null;

        var vm = this;
        vm.totalCostData = null;
        vm.chartConfig = null;
        vm.resultsChartConfig = null;
        vm.decreaseMultiplier = decreaseMultiplier;
        vm.increaseMultiplier = increaseMultiplier;
        vm.resetMultiplier = resetMultiplier;

        initialize();

        /* Implementations */

        function initialize() {
            configureCharts();
            loadChartData();
        }

        function decreaseMultiplier() {
            resourcePoolService.decreaseMultiplier(resourcePoolId)
                .success(function () {
                    loadChartData();
                });
        }

        function increaseMultiplier() {
            resourcePoolService.increaseMultiplier(resourcePoolId)
                .success(function () {
                    loadChartData();
                });
        }

        function resetMultiplier() {
            resourcePoolService.resetMultiplier(resourcePoolId)
                .success(function () {
                    loadChartData();
                });
        }

        //function decreaseMultiplier() {
        //    userResourcePoolService.decreaseMultiplier(vm.totalCostData.Id)
        //        .success(function () {
        //            refreshChartData();
        //        });
        //}

        //function decreaseResourcePoolRate() {
        //    userResourcePoolService.decreaseResourcePoolRate(vm.totalCostData.Id)
        //        .success(function () {
        //            refreshChartData();
        //        });
        //}

        //function increaseMultiplier() {
        //    userResourcePoolService.increaseMultiplier(vm.totalCostData.Id)
        //        .success(function () {
        //            refreshChartData();
        //        });
        //}

        //function increaseResourcePoolRate() {
        //    userResourcePoolService.increaseResourcePoolRate(vm.totalCostData.Id)
        //        .success(function () {
        //            refreshChartData();
        //        });
        //}

        //function resetMultiplier() {
        //    userResourcePoolService.resetMultiplier(vm.totalCostData.Id)
        //        .success(function () {
        //            refreshChartData();
        //        });
        //}

        //function refreshPage() {

        //    var organizationIndex = Math.floor(Math.random() * 4);
        //    vm.oldSystemChartConfig.series[organizationIndex].data[0] += 1;
        //    vm.newSystemChartConfig.series[0].data[0] += 1;

        //    refreshTimeout = $timeout(refreshPage, 1000);
        //}

        //function decrease(index) {
        //    vm.chartData[index].y = vm.chartData[index].y - 5 < 0
        //        ? 0
        //        : vm.chartData[index].y - 5;
        //}

        //function increase(index) {
        //    vm.chartData[index].y += 5;
        //}

        function configureCharts() {

            // Old
            vm.chartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Number of sales' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Units'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                }
            };

            // New
            vm.resultsChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Number of sales' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Units'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
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

                    for (var elementItemIndex = 0; elementItemIndex < vm.userResourcePool.MainElement.ElementItemSet.length; elementItemIndex++) {

                        var elementItem = vm.userResourcePool.MainElement.ElementItemSet[elementItemIndex];

                        var chartDataItem = {
                            name: elementItem.Name,
                            data: [elementItem.TotalResourcePoolValue]
                        };

                        vm.chartData.push(chartDataItem);

                    }

                    //userElementCellService.getUserElementCellSetByResourcePoolId(vm.userResourcePool.Id, true)
                    //    .then(function (userElementCellSet) {

                    //        for (var userElementCellIndex = 0; userElementCellIndex < userElementCellSet.length; userElementCellIndex++) {

                    //            var userElementCell = userElementCellSet[userElementCellIndex];

                    //            var chartDataItem = {
                    //                name: vm.totalCostData.UserOrganizationSet[i].OrganizationName,
                    //                data: [vm.totalCostData.UserOrganizationSet[i].TotalProfit]
                    //            }

                    //            var chartDataItem = {
                    //                name: userElementCell.ElementCell.ElementItem.Name,
                    //                data: [ userElementCell.Rating ]
                    //            };

                    //            vm.chartData.push(chartDataItem);
                    //        }


                    //    });

                    //vm.chartConfig.series = [{ data: vm.chartData }];
                    vm.chartConfig.series = vm.chartData;
                    vm.chartConfig.loading = false;

                    // Results
                    vm.resultsSectorSet = [];

                    for (var i = 0; i < vm.userResourcePool.MainElement.ElementItemSet.length; i++) {
                        var chartDataItem = {
                            name: vm.userResourcePool.MainElement.ElementItemSet[i].Name,
                            data: [vm.userResourcePool.MainElement.ElementItemSet[i].TotalIncome]
                        }
                        vm.resultsSectorSet.push(chartDataItem);
                    }

                    // vm.resultsChartConfig.series = [{ data: vm.resultsSectorSet }];
                    vm.resultsChartConfig.series = vm.resultsSectorSet;
                    vm.resultsChartConfig.loading = false;

                });

            //vm.chartConfig.loading = true;
            //vm.resultsChartConfig.loading = true;

            // TODO !
            //userResourcePoolService. getUserResourcePool ... (resourcePoolId)
            //    .success(function (userResourcePool) {
            //        vm.totalCostData = userResourcePool;

            //        // Convert
            //        var chartData = [];
            //        var chartData2 = [];
            //        for (var i = 0; i < vm.totalCostData.UserOrganizationSet.length; i++) {

            //            // Old
            //            var chartDataItem = {
            //                name: vm.totalCostData.UserOrganizationSet[i].OrganizationName,
            //                data: [vm.totalCostData.UserOrganizationSet[i].TotalProfit]
            //            }
            //            chartData.push(chartDataItem);

            //            // New
            //            var chartDataItem2 = {
            //                name: vm.totalCostData.UserOrganizationSet[i].OrganizationName,
            //                data: [vm.totalCostData.UserOrganizationSet[i].TotalIncome]
            //            }
            //            chartData2.push(chartDataItem2);
            //        }

            //        vm.chartConfig.series = chartData;
            //        vm.resultsChartConfig.series = chartData2;

            //        vm.chartConfig.loading = false;
            //        vm.resultsChartConfig.loading = false;

            //    });
        }

        function refreshChartData() {

            vm.chartConfig.loading = true;
            vm.resultsChartConfig.loading = true;

            // TODO

            //userResourcePoolService. getUserResourcePool ... (resourcePoolId)
            //    .success(function (userResourcePool) {
            //        vm.totalCostData = userResourcePool;

            //        // Convert
            //        // Old
            //        for (var i = 0; i < vm.totalCostData.UserOrganizationSet.length; i++) {
            //            vm.chartConfig.series[i].data[0] = vm.totalCostData.UserOrganizationSet[i].TotalProfit;
            //        }

            //        // New
            //        for (var i = 0; i < vm.totalCostData.UserOrganizationSet.length; i++) {
            //            vm.resultsChartConfig.series[i].data[0] = vm.totalCostData.UserOrganizationSet[i].TotalIncome;
            //        }

            //        vm.chartConfig.loading = false;
            //        vm.resultsChartConfig.loading = false;
            //    });
        }

        //function resetChanges() {
        //    loadChartData();
        //}

        //function saveChanges() {

        //    userLicenseRatingService.getUserLicenseRatingSetByResourcePoolId(resourcePoolId, false)
        //        .then(function (data) {

        //            // Convert chart data to userSectorRating
        //            for (var i = 0; i < vm.chartData.length; i++) {
        //                var dataItem = data[i];
        //                var chartDataItem = vm.chartData[i];

        //                if (dataItem.Rating !== chartDataItem.y) {
        //                    dataItem.Rating = chartDataItem.y;
        //                }
        //            }

        //            userLicenseRatingService.saveChanges()
        //                .then(function () {
        //                    logger.logSuccess('Your changes have been saved!', null, true);

        //                    vm.displayLicenseResult = true;

        //                    loadChartData();
        //                });
        //        });
        //}
    };
})();
