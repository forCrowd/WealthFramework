(function () {
    'use strict';

    var resourcePoolEditorDirectiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(resourcePoolEditorDirectiveId, ['resourcePoolService',
            'elementService',
            'userElementCellService',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService, elementService, userElementCellService, $rootScope, logger) {
        logger = logger.forSource(resourcePoolEditorDirectiveId);

        function link(scope, element, attrs) {

            scope.resourcePool = null;
            scope.chartConfig = null;
            scope.decreaseMultiplier = decreaseMultiplier;
            scope.increaseMultiplier = increaseMultiplier;
            scope.resetMultiplier = resetMultiplier;
            scope.updateResourcePoolRate = updateResourcePoolRate;
            
            scope.currentElementIndex = 0;
            scope.toggleMainElement = function () {

                scope.currentElementIndex++;

                if (typeof scope.resourcePool.ElementSet[scope.currentElementIndex] === 'undefined') {
                    scope.currentElementIndex = 0;
                }

                scope.resourcePool.currentElement = scope.resourcePool.ElementSet[scope.currentElementIndex];
            }

            //scope.updateValueFilter = updateValueFilter;
            scope.toggleValueFilter = function () {
                scope.valueFilter = scope.valueFilter === 1 ? 2 : 1;
                getResourcePool();
            }
            scope.valueFilterText = function () {
                return scope.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            initialize();

            function initialize() {

                // Value filter
                scope.valueFilter = 1;

                // Highchart initial config
                scope.chartConfig = {
                    options: {
                        chart: {
                            type: ''
                        },
                        plotOptions: {
                            column: {
                                allowPointSelect: true,
                                pointWidth: 15
                            },
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        xAxis: { categories: [''] },
                        yAxis: {
                            allowDecimals: false,
                            min: 0
                        }
                    }
                };

                // Watches
                scope.$watch('resourcePoolId', function () {
                    getResourcePool();
                }, true);

                scope.$watch('chartHeight', function () {
                    scope.chartConfig.options.chart.height = scope.chartHeight;
                }, true);

                // Listen resource pool updated event
                $rootScope.$on('resourcePool_MultiplierIncreased', resourcePoolUpdated);
                $rootScope.$on('resourcePool_MultiplierDecreased', resourcePoolUpdated);
                $rootScope.$on('resourcePool_MultiplierReset', resourcePoolUpdated);
                $rootScope.$on('resourcePool_ResourcePoolRateUpdated', resourcePoolUpdated);
                $rootScope.$on('resourcePool_Saved', resourcePoolUpdated);

                $rootScope.$on('element_MultiplierIncreased', elementUpdated);
                $rootScope.$on('element_MultiplierDecreased', elementUpdated);
                $rootScope.$on('element_MultiplierReset', elementUpdated);

                function resourcePoolUpdated(event, resourcePoolId) {
                    if (scope.resourcePoolId === resourcePoolId)
                        getResourcePool();
                }

                function elementUpdated(event, elementId) {
                    // TODO Can it be done through element.ResourcePool = resourcePool or somethin'?
                    for (var i = 0; i < scope.resourcePool.ElementSet.length; i++) {
                        if (scope.resourcePool.ElementSet[i].Id === elementId) {
                            getResourcePool();
                            break;
                        }
                    }
                }
            }

            function getResourcePool() {

                resourcePoolService.getResourcePoolCustom(scope.resourcePoolId, scope.valueFilter)
                    .success(function (resourcePool) {

                        // Resource pool
                        scope.resourcePool = resourcePool;

                        if (typeof scope.resourcePool.currentElement === 'undefined') {
                            scope.resourcePool.currentElement = resourcePool.MainElement;
                        }

                        for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                            var elementItem = resourcePool.MainElement.ElementItemSet[i];

                            for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                                var elementCell = elementItem.ElementCellSet[x];

                                if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                                    elementCell.increaseIndexCellValue = function () {
                                        updateIndexCellValue(this, 'increase');
                                    }

                                    elementCell.decreaseIndexCellValue = function () {
                                        updateIndexCellValue(this, 'decrease');
                                    }
                                }
                            }
                        }

                        // Update Highchart data
                        scope.chartConfig.loading = true;

                        // New or existing?
                        if (typeof scope.chartConfig.resourcePoolId === 'undefined'
                            || scope.chartConfig.resourcePoolId !== resourcePool.Id) {

                            scope.chartConfig.resourcePoolId = resourcePool.Id;
                            scope.chartConfig.title = resourcePool.Name;
                            scope.chartConfig.series = [];

                            // Column type
                            if (resourcePool.MainElement.HasResourcePoolField) {

                                scope.chartConfig.options.chart.type = 'column';
                                scope.chartConfig.options.yAxis.title = { text: 'Total Income' };

                                for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                                    var elementItem = resourcePool.MainElement.ElementItemSet[i];
                                    var chartDataItem = {
                                        name: elementItem.Name,
                                        data: [elementItem.TotalIncome]
                                    };
                                    scope.chartConfig.series.push(chartDataItem);
                                }
                            } else {

                                // Pie type
                                scope.chartConfig.options.chart.type = 'pie';
                                scope.chartConfig.options.yAxis.title = { text: '' };

                                var chartData = [];
                                for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                                    var elementItem = resourcePool.MainElement.ElementItemSet[i];

                                    for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                                        var elementCell = elementItem.ElementCellSet[x];

                                        if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                                            var chartDataItem = {
                                                name: elementItem.Name,
                                                y: elementCell.ValuePercentage
                                            };
                                            chartData.push(chartDataItem);
                                        }
                                    }
                                }

                                scope.chartConfig.series = [{ data: chartData }];
                            }
                        } else {
                            if (resourcePool.MainElement.HasResourcePoolField) {
                                for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                                    var elementItem = resourcePool.MainElement.ElementItemSet[i];
                                    var chartDataItem = scope.chartConfig.series[i];
                                    chartDataItem.data = [elementItem.TotalIncome];
                                }
                            } else {
                                for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                                    var elementItem = resourcePool.MainElement.ElementItemSet[i];

                                    for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                                        var elementCell = elementItem.ElementCellSet[x];

                                        if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                                            var chartDataItem = scope.chartConfig.series[0].data[i];
                                            chartDataItem.y = elementCell.ValuePercentage;
                                        }
                                    }
                                }
                            }
                        }

                        scope.chartConfig.loading = false;

                    });

                function updateIndexCellValue(elementCell, type) {

                    userElementCellService.getUserElementCellSetByElementCellId(elementCell.Id, true)
                        .then(function (userElementCellSet) {

                            var userElementCell = null;

                            if (userElementCellSet.length > 0) {
                                userElementCell = userElementCellSet[0];
                                userElementCell.DecimalValue = type === 'increase'
                                    ? userElementCell.DecimalValue + 10
                                    : userElementCell.DecimalValue - 10;

                                var rowVersion = userElementCell.RowVersion;
                                userElementCell.RowVersion = '';
                                userElementCell.RowVersion = rowVersion;
                            }
                            else {
                                // TODO UserId?
                                userElementCell.ElementCellId = elementCell.Id;
                                userElementCell.DecimalValue = type === 'increase' // TODO ?
                                    ? 55
                                    : 45;
                                userElementCellService.createUserElementCell(userElementCell);
                            }

                            userElementCellService.saveChanges()
                                .then(function () {
                                    getResourcePool();
                                });
                        });
                }
            }

            function decreaseMultiplier() {
                resourcePoolService.decreaseMultiplier(scope.resourcePoolId);
            }

            function increaseMultiplier() {
                resourcePoolService.increaseMultiplier(scope.resourcePoolId);
            }

            function resetMultiplier() {
                resourcePoolService.resetMultiplier(scope.resourcePoolId);
            }

            function updateResourcePoolRate(rate) {
                resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, rate);
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/App/views/directives/resourcePoolEditor.html',
            scope: {
                resourcePoolId: '=',
                chartHeight: '='
            },
            link: link
        };
    };

    /* Element Editor */

    var elementEditorDirectiveId = 'elementEditor';

    angular.module('main')
        .directive(elementEditorDirectiveId, ['elementService',
            'logger',
            elementEditor]);

    function elementEditor(elementService, logger) {
        logger = logger.forSource(elementEditorDirectiveId);

        function link(scope, element, attrs) {

            // Watches
            scope.$watch('element', function () {

                if (typeof scope.element !== 'undefined') {
                    scope.element.increaseMultiplier = increaseMultiplier;
                    scope.element.decreaseMultiplier = decreaseMultiplier;
                    scope.element.resetMultiplier = resetMultiplier;
                }

            }, true);

            function decreaseMultiplier() {
                elementService.decreaseMultiplier(scope.element.Id);
            }

            function increaseMultiplier() {
                elementService.increaseMultiplier(scope.element.Id);
            }

            function resetMultiplier() {
                elementService.resetMultiplier(scope.element.Id);
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/App/views/directives/elementEditor.html',
            scope: {
                element: '=',
                enableResourcePoolAddition: '=',
                enableSubtotals: '='
            },
            link: link
        };
    }

})();
