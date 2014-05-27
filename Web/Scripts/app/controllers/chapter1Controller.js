(function () {
    'use strict';

    var controllerId = 'chapter1Controller';
    angular.module('main')
        .controller(controllerId, ['logger', chapter1Controller]);

    function chapter1Controller(logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.chartData = null;
        vm.decrease = decrease;
        vm.increase = increase;
        vm.resetChanges = resetChanges;

        initialize();

        /* Implementations */

        function initialize() {
            configureChart();
            loadChartData();
        }

        function decrease() {
            vm.chartData[0].data[0] = vm.chartData[0].data[0] - 1 < 0
                ? 0
                : vm.chartData[0].data[0] - 1;
        }

        function increase() {
            vm.chartData[0].data[0] += 1;
        }

        function configureChart() {
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
            }
        }

        function loadChartData() {

            vm.chartConfig.loading = true;

            vm.chartData = [{ name: 'UPO', data: [0] }];

            vm.chartConfig.series = vm.chartData;
            vm.chartConfig.loading = false;
        }

        function resetChanges() {
            loadChartData();
        }
    };
})();
