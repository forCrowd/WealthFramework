(function () {
    'use strict';

    var controllerId = 'chapter5Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userElementCellService', '$scope', '$timeout', 'logger', chapter5Controller]);

    function chapter5Controller(resourcePoolService, userElementCellService, $scope, $timeout, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 2;

        var refreshTimeout = null;

        var vm = this;
        vm.chartData = null;
        vm.decrease = decrease;
        vm.oldSystemChartConfig = null;
        vm.newSystemChartConfig = null;
        vm.increase = increase;
        vm.chartConfig = null;
        vm.displayResults = false;
        vm.resultsChartConfig = null;
        vm.resultsSectorSet = [];
        vm.resetChanges = resetChanges;
        vm.saveChanges = saveChanges;

        initialize();

        /* Implementations */

        function initialize() {
            configureCharts();
            loadChartData();

            refreshTimeout = $timeout(refreshPage, 5000);

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            $scope.$on("$destroy", function (event) {
                $timeout.cancel(refreshTimeout);
            });
        }

        function refreshPage() {

            var organizationIndex = Math.floor(Math.random() * 4);
            vm.oldSystemChartConfig.series[organizationIndex].data[0] += 1;
            vm.newSystemChartConfig.series[0].data[0] += 1;

            refreshTimeout = $timeout(refreshPage, 1000);
        }

        function decrease(index) {
            vm.chartData[index].y = vm.chartData[index].y - 5 < 0
                ? 0
                : vm.chartData[index].y - 5;
        }

        function increase(index) {
            vm.chartData[index].y += 5;
        }

        function configureCharts() {

            vm.oldSystemChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Development process' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Knowledge'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                },
                series: [
                    { name: "My Precious", data: [0] },
                    { name: 'Death Star Plans', data: [0] },
                    { name: "Vicky's Secret", data: [0] },
                    { name: 'Nuka Cola Formula', data: [0] }
                ]
            };

            vm.newSystemChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Development process' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Knowledge'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                },
                series: [
                    { name: 'Global Knowledge Database', data: [0] }
                ]
            };

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

                            // vm.licenseChartConfig.loading = true;
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

                            var rowVersion = dataItem.RowVersion;
                            dataItem.RowVersion = '';
                            dataItem.RowVersion = rowVersion;
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
