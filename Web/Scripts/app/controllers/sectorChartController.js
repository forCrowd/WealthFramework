(function () {
    'use strict';

    var controllerId = 'sectorChartController';
    angular.module('main')
        .controller(controllerId, ['userSectorRatingService', 'logger', sectorChartController]);

    function sectorChartController(userSectorRatingService, logger) {
        logger = logger.forSource(controllerId);

        var chartData = [];

        var vm = this;
        vm.increase = increase;
        vm.decrease = decrease;

        initialize();

        function initialize() {
            configureChart();
            loadChartData();
        }

        function increase() {
            chartData[0].y += 10;
        }

        function decrease() {
            chartData[0].y -= 10;
        }

        function configureChart() {
            vm.chartConfig = {
                title: {
                    text: 'Sectors'
                },
                options: {
                    chart: {
                        type: 'pie'
                    }
                },
                loading: true
            }
        }

        function loadChartData() {

            userSectorRatingService.getUserSectorRatingSet(false)
                .then(function (data) {

                    // Convert the data and set it
                    for (var i = 0; i < data.length; i++) {
                        var chartDataItem = {
                            name: data[i].Sector.Name,
                            y: data[i].Rating
                        }
                        chartData.push(chartDataItem);
                    }

                    vm.chartConfig.series = [{ data: chartData }];
                    vm.chartConfig.loading = false;
                });
        }
    };
})();
