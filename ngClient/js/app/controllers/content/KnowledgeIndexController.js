(function () {
    'use strict';

    var controllerId = 'KnowledgeIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', '$timeout', 'logger', KnowledgeIndexController]);

    function KnowledgeIndexController(resourcePoolFactory, userFactory, $scope, $timeout, logger) {

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
        vm.knowledgeIndexConfig = { resourcePoolId: 3 };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', updateAllInOne);

        _init();

        function _init() {
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
        }

        // Sync this example's values with 'All in One'
        function updateAllInOne(event, cell) {

            var allInOneId = 7;

            if (cell.ElementField.Element.ResourcePoolId !== vm.knowledgeIndexConfig.resourcePoolId) {
                return;
            }

            resourcePoolFactory.getResourcePoolExpanded(allInOneId)
                .then(function (resourcePool) {

                    // If the current user already interacted with 'All in One', stop copying ratings
                    if (typeof resourcePool.userInteracted !== 'undefined' && resourcePool.userInteracted) {
                        return;
                    }

                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        if (element.Name === cell.ElementField.Element.Name) {
                            // Element fields
                            for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                var elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === cell.ElementField.Name) {
                                    // Element cells
                                    for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        var elementCell = elementField.ElementCellSet[elementCellIndex];
                                        if (elementCell.ElementItem.Name === cell.ElementItem.Name) {
                                            switch (event.name) {
                                                case 'resourcePoolEditor_elementCellNumericValueIncreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'increase');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueDecreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'decrease');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueReset': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'reset');
                                                    break;
                                                }
                                            }

                                            // Save changes
                                            resourcePoolFactory.saveChanges(1500);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
})();
