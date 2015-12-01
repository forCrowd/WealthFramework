(function () {
    'use strict';

    var controllerId = 'knowledgeIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['$scope', '$timeout', 'logger', knowledgeIndexSampleController]);

    function knowledgeIndexSampleController($scope, $timeout, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.oldModelChartConfig = {
            title: {
                text: ''
            },
            options: {
                chart: {
                    type: 'column',
                    height: 358
                },
                plotOptions: {
                    column: {
                        allowPointSelect: true,
                        pointWidth: 15
                    }
                },
                xAxis: { categories: ['Knowledge'] },
                yAxis: {
                    title: {
                        text: 'Development process'
                    },
                    allowDecimals: false,
                    min: 0
                }
            },
            size: {},
            series: [
                { name: "My Precious Jewelry", data: [0] },
                { name: 'Death Star Architecture', data: [0] },
                { name: "Christina's Secret", data: [0] },
                { name: 'Nuka Cola Company', data: [0] }
            ]
        };

        vm.newModelChartConfig = {
            title: {
                text: ''
            },
            options: {
                chart: {
                    type: 'column',
                    height: 300
                },
                plotOptions: {
                    column: {
                        allowPointSelect: true,
                        pointWidth: 15
                    }
                },
                xAxis: { categories: ['Knowledge'] },
                yAxis: {
                    title: {
                        text: 'Development process'
                    },
                    allowDecimals: false,
                    min: 0
                }
            },
            size: {},
            series: [
                { name: 'Global Knowledge Database', data: [0] }
            ]
        };

        var timeout = $timeout(refreshPage, 10000);

        function refreshPage() {

            var organizationIndex = Math.floor(Math.random() * 4);
            vm.oldModelChartConfig.series[organizationIndex].data[0] += 1;
            vm.newModelChartConfig.series[0].data[0] += 1;

            timeout = $timeout(refreshPage, 1000);
        }

        // When the DOM element is removed from the page,
        // AngularJS will trigger the $destroy event on
        // the scope. This gives us a chance to cancel any
        // pending timer that we may have.
        $scope.$on("$destroy", function (event) {
            $timeout.cancel(timeout);
        });
    };
})();
