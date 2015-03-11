(function () {
    'use strict';

    var controllerId = 'knowledgeIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$scope', '$timeout', '$rootScope', 'logger', knowledgeIndexSampleController]);

    function knowledgeIndexSampleController(userService, $scope, $timeout, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.authorized = false; // TODO Improve this 'authorized' part?

        userService.getUserInfo()
            .then(function (userInfo) {

                vm.authorized = true;

                initialize();
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.authorized = false;
        });

        /*** Implementations ***/

        function initialize() {

            vm.knowledgeIndex_OldSystemChartConfig = null;
            vm.knowledgeIndex_NewSystemChartConfig = null;
            vm.knowledgeIndex_SampleResourcePoolId = 5;
            vm.knowledgeIndex_PopuplarSoftwareLicensesResourcePoolId = 6;
            var timeoutInitial = $timeout(refreshPage, 10000);
            var timeoutRecursive = null;

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            $scope.$on("$destroy", function (event) {
                $timeout.cancel(timeoutInitial);
                $timeout.cancel(timeoutRecursive);
            });

            vm.knowledgeIndex_OldSystemChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column',
                        height: 358
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
                    { name: "My Precious Jewelry", data: [0] },
                    { name: 'Death Star Architecture', data: [0] },
                    { name: "Christina's Secret", data: [0] },
                    { name: 'Nuka Cola Formula', data: [0] }
                ]
            };

            vm.knowledgeIndex_NewSystemChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column',
                        height: 300
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

            function refreshPage() {

                var organizationIndex = Math.floor(Math.random() * 4);
                vm.knowledgeIndex_OldSystemChartConfig.series[organizationIndex].data[0] += 1;
                vm.knowledgeIndex_NewSystemChartConfig.series[0].data[0] += 1;

                timeoutRecursive = $timeout(refreshPage, 1000);
            }
        }
    };
})();
