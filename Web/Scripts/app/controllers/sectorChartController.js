(function () {
    'use strict';

    var controllerId = 'sectorChartController';
    angular.module('main')
        .controller(controllerId, ['userSectorRatingService', 'logger', sectorChartController]);

    function sectorChartController(userSectorRatingService, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 6;

        var vm = this;
        vm.chartData = null;
        vm.decrease = decrease;
        vm.increase = increase;
        vm.resetChanges = resetChanges;
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
            }
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
                        });
                });
        }
    };
})();
