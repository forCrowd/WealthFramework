(function () {
    'use strict';

    var controllerId = 'chapter4Controller';
    angular.module('main')
        .controller(controllerId, ['userSectorRatingService', 'resourcePoolService', 'logger', chapter4Controller]);

    function chapter4Controller(userSectorRatingService, resourcePoolService, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 6;

        var vm = this;
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

        /* Implementations */

        function initialize() {
            configureChart();
            loadChartData();
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

            userSectorRatingService.getUserSectorRatingSetByResourcePoolId(resourcePoolId, false)
                .then(function (data) {

                    // Convert userSectorRating to chart data
                    vm.chartData = [];
                    for (var i = 0; i < data.length; i++) {
                        var chartDataItem = {
                            name: data[i].Sector.Name,
                            y: data[i].Rating
                        }
                        vm.chartData.push(chartDataItem);
                    }

                    vm.chartConfig.series = [{ data: vm.chartData }];
                    vm.chartConfig.loading = false;
                });

            // Results chart

            vm.resultsChartConfig.loading = true;

            resourcePoolService.getSectorSet(resourcePoolId)
                .success(function (sectorSet) {

                    vm.resultsSectorSet = sectorSet;

                    // Convert sectorSet to chart data
                    var resultsChartData = [];
                    for (var i = 0; i < vm.resultsSectorSet.length; i++) {
                        var chartDataItem = {
                            name: vm.resultsSectorSet[i].SectorName,
                            y: vm.resultsSectorSet[i].RatingAverage
                        }
                        resultsChartData.push(chartDataItem);
                    }

                    vm.resultsChartConfig.series = [{ data: resultsChartData }];
                    vm.resultsChartConfig.loading = false;

                });
        }

        function resetChanges() {
            loadChartData();
        }

        function saveChanges() {

            userSectorRatingService.getUserSectorRatingSetByResourcePoolId(resourcePoolId, false)
                .then(function (data) {

                    // Convert chart data to userSectorRating
                    for (var i = 0; i < vm.chartData.length; i++) {
                        var dataItem = data[i];
                        var chartDataItem = vm.chartData[i];

                        if (dataItem.Rating !== chartDataItem.y)
                        {
                            dataItem.Rating = chartDataItem.y;

                            var rowVersion = dataItem.RowVersion;
                            dataItem.RowVersion = '';
                            dataItem.RowVersion = rowVersion;
                        }
                    }

                    userSectorRatingService.saveChanges()
                        .then(function () {
                            logger.logSuccess('Your changes have been saved!', null, true);

                            vm.displayResults = true;

                            loadChartData();
                        });
                });
        }
    };
})();
