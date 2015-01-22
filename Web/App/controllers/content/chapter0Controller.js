(function () {
    'use strict';

    var controllerId = 'chapter0Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', '$scope', '$timeout', '$rootScope', 'logger', chapter0Controller]);

    function chapter0Controller(resourcePoolService, $scope, $timeout, $rootScope, logger) {

        var vm = this;

        /* Static Ids */
        vm.UPOSampleResourcePoolId = 1;
        vm.basicsExistingModelResourcePoolId = 2;
        vm.basicsNewModelResourcePoolId = 3;
        vm.sectorIndexSampleResourcePoolId = 4;
        vm.knowledgeIndexOldSystemChartConfig = null;
        vm.knowledgeIndexNewSystemChartConfig = null;
        vm.knowledgeIndexSampleResourcePoolId = 5;

        logger = logger.forSource(controllerId);

        initialize();

        /* Implementations */

        function initialize() {

            initializeIntroduction();
            initializeBasics();
            initializeKnowledgeIndex();

            function initializeIntroduction() {

                // Initial start
                var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 5000);
                var increaseMultiplierTimeoutRecursive = null;

                function increaseMultiplier() {

                    // Call the service to increase the multiplier
                    resourcePoolService.increaseMultiplier(1);

                    // Then increase recursively
                    // TODO Decrease this timeout interval
                    var increaseMultiplierTimeoutRecursive = $timeout(increaseMultiplier, 100000);
                }

                // When the DOM element is removed from the page,
                // AngularJS will trigger the $destroy event on
                // the scope. This gives us a chance to cancel any
                // pending timer that we may have.
                $scope.$on("$destroy", function (event) {
                    $timeout.cancel(increaseMultiplierTimeoutInitial);
                    $timeout.cancel(increaseMultiplierTimeoutRecursive);
                });
            }

            function initializeBasics() {

                // Listen resource pool updated event
                $rootScope.$on('resourcePool_MultiplierIncreased', updateOppositeResourcePool);
                $rootScope.$on('resourcePool_MultiplierDecreased', updateOppositeResourcePool);
                $rootScope.$on('resourcePool_MultiplierReset', updateOppositeResourcePool);

                function updateOppositeResourcePool(event, resourcePoolId, eventSource) {
                    
                    if ((resourcePoolId === vm.basicsExistingModelResourcePoolId
                        || resourcePoolId === vm.basicsNewModelResourcePoolId)
                        && eventSource !== 'chapter0Controller') {

                        var oppositeResourcePoolId = resourcePoolId === vm.basicsExistingModelResourcePoolId
                            ? vm.basicsNewModelResourcePoolId
                            : vm.basicsExistingModelResourcePoolId;

                        switch (event.name) {
                            case 'resourcePool_MultiplierIncreased': { resourcePoolService.increaseMultiplier(oppositeResourcePoolId, 'chapter0Controller'); break; }
                            case 'resourcePool_MultiplierDecreased': { resourcePoolService.decreaseMultiplier(oppositeResourcePoolId, 'chapter0Controller'); break; }
                            case 'resourcePool_MultiplierReset': { resourcePoolService.resetMultiplier(oppositeResourcePoolId, 'chapter0Controller'); break; }
                        }
                    }
                }

            }

            function initializeKnowledgeIndex() {

                var timeoutInitial = $timeout(refreshPage, 5000);
                var timeoutRecursive = null;

                // When the DOM element is removed from the page,
                // AngularJS will trigger the $destroy event on
                // the scope. This gives us a chance to cancel any
                // pending timer that we may have.
                $scope.$on("$destroy", function (event) {
                    $timeout.cancel(timeoutInitial);
                    $timeout.cancel(timeoutRecursive);
                });

                vm.knowledgeIndexOldSystemChartConfig = {
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
                        { name: "My Precious", data: [0] },
                        { name: 'Death Star Plans', data: [0] },
                        { name: "Vicky's Secret", data: [0] },
                        { name: 'Nuka Cola Formula', data: [0] }
                    ]
                };

                vm.knowledgeIndexNewSystemChartConfig = {
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
                    vm.knowledgeIndexOldSystemChartConfig.series[organizationIndex].data[0] += 1;
                    vm.knowledgeIndexNewSystemChartConfig.series[0].data[0] += 1;

                    timeoutRecursive = $timeout(refreshPage, 1000);
                }
            }
        }
    };
})();
