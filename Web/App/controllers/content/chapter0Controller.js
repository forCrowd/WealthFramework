(function () {
    'use strict';

    var controllerId = 'chapter0Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', '$scope', '$timeout', '$rootScope', 'logger', chapter0Controller]);

    function chapter0Controller(resourcePoolService, $scope, $timeout, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;

        initialize();

        /* Implementations */

        function initialize() {

            initializeIntroduction();
            initializeBasics();
            initializeSectorIndex();
            initializeKnowledgeIndex();

            function initializeIntroduction() {

                vm.introduction_UPOResourcePoolId = 1;

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

                vm.basics_ExistingModelResourcePoolId = 2;
                vm.basics_NewModelResourcePoolId = 3;

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

            function initializeSectorIndex() {
                vm.sectorIndex_SampleResourcePoolId = 4;
            }

            function initializeKnowledgeIndex() {

                vm.knowledgeIndex_OldSystemChartConfig = null;
                vm.knowledgeIndex_NewSystemChartConfig = null;
                vm.knowledgeIndex_SampleResourcePoolId = 5;
                vm.knowledgeIndex_PopuplarSoftwareLicensesResourcePoolId = 6;
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
        }
    };
})();
