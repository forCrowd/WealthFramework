module M30 {
    'use strict';

    var directiveId = 'resourcePoolEditor';

    function resourcePoolEditor(dataContext: any, Enums: any, logger: any, resourcePoolFactory: any, $location: any, $rootScope: any) {

        // Logger
        logger = logger.forSource(directiveId);

        function link(scope: any, elm: any, attrs: any);
        function link(scope, elm, attrs) {

            // Scope variables
            scope.currentUser = null;
            scope.displayDescription = true;
            scope.displayIndexDetails = false;
            scope.errorMessage = '';
            scope.isSaving = false;
            scope.resourcePool = { Name: 'Loading...' };
            scope.resourcePoolKey = '';
            scope.userName = '';

            // Functions
            scope.changeSelectedElement = changeSelectedElement;
            scope.decreaseElementCellNumericValue = decreaseElementCellNumericValue;
            scope.decreaseElementMultiplier = decreaseElementMultiplier;
            scope.decreaseIndexRating = decreaseIndexRating;
            scope.decreaseResourcePoolRate = decreaseResourcePoolRate;
            scope.editResourcePool = editResourcePool;
            scope.increaseElementCellNumericValue = increaseElementCellNumericValue;
            scope.increaseElementMultiplier = increaseElementMultiplier;
            scope.increaseIndexRating = increaseIndexRating;
            scope.increaseResourcePoolRate = increaseResourcePoolRate;
            scope.resetElementCellNumericValue = resetElementCellNumericValue;
            scope.resetElementMultiplier = resetElementMultiplier;
            scope.resetIndexRating = resetIndexRating;
            scope.resetResourcePoolRate = resetResourcePoolRate;
            scope.toggleDescription = toggleDescription;
            scope.toggleIndexDetails = toggleIndexDetails;

            // Event handlers
            scope.$watch('config', configChanged, true);
            scope.$on('saveChangesStart', saveChangesStart);
            scope.$on('saveChangesCompleted', saveChangesCompleted);
            scope.$on('dataContext_currentUserChanged', currentUserChanged);

            /*** Implementations ***/

            function changeSelectedElement(element: any);
            function changeSelectedElement(element) {
                scope.resourcePool.selectedElement(element);
                loadChartData();
            }

            function configChanged() {
                var userName = typeof scope.config.userName === 'undefined' ? '' : scope.config.userName;
                var resourcePoolKey = typeof scope.config.resourcePoolKey === 'undefined' ? '' : scope.config.resourcePoolKey;

                initialize(dataContext.getCurrentUser(), userName, resourcePoolKey);
            }

            function decreaseElementCellNumericValue(cell: any);
            function decreaseElementCellNumericValue(cell) {
                resourcePoolFactory.updateElementCellDecimalValue(cell, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueDecreased', cell);
                saveChanges();
            }

            function decreaseElementMultiplier(element: any);
            function decreaseElementMultiplier(element) {
                resourcePoolFactory.updateElementMultiplier(element, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
                saveChanges();
            }

            function decreaseIndexRating(field: any);
            function decreaseIndexRating(field) {
                resourcePoolFactory.updateElementFieldIndexRating(field, 'decrease');
                saveChanges();
            }

            function decreaseResourcePoolRate() {
                resourcePoolFactory.updateResourcePoolRate(scope.resourcePool, 'decrease');
                saveChanges();
            }

            function editResourcePool() {
                // TODO Instead of having fixed url here, broadcast an 'edit request'?
                $location.url(scope.resourcePool.urlEdit());
            }

            function increaseElementCellNumericValue(cell: any);
            function increaseElementCellNumericValue(cell) {
                resourcePoolFactory.updateElementCellDecimalValue(cell, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueIncreased', cell);
                saveChanges();
            }

            function increaseElementMultiplier(element: any);
            function increaseElementMultiplier(element) {
                resourcePoolFactory.updateElementMultiplier(element, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
                saveChanges();
            }

            function increaseIndexRating(field: any);
            function increaseIndexRating(field) {
                resourcePoolFactory.updateElementFieldIndexRating(field, 'increase');
                saveChanges();
            }

            function increaseResourcePoolRate() {
                resourcePoolFactory.updateResourcePoolRate(scope.resourcePool, 'increase');
                saveChanges();
            }

            function initialize(user: any, userName: any, resourcePoolKey: any);
            function initialize(user, userName, resourcePoolKey) {

                if (scope.currentUser !== user || scope.userName !== userName || scope.resourcePoolKey !== resourcePoolKey) {
                    scope.currentUser = user;
                    scope.userName = userName;
                    scope.resourcePoolKey = resourcePoolKey;

                    // Clear previous error messages
                    scope.errorMessage = '';

                    scope.chartConfig = {
                        credits: {
                            enabled: false
                        },
                        loading: true,
                        options: {
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
                            tooltip: {
                                headerFormat: ''
                            },
                            xAxis: { categories: [''] },
                            yAxis: {
                                allowDecimals: false,
                                min: 0
                            }
                        },
                        size: {},
                        title: { text: '' }
                    };

                    // Validate
                    if (scope.userName === '' || scope.resourcePoolKey === '') {
                        scope.errorMessage = 'CMRP Id cannot be null';
                        scope.chartConfig.loading = false;
                        return;
                    }

                    var resourcePoolUniqueKey = { userName: scope.userName, resourcePoolKey: scope.resourcePoolKey };

                    // Get resource pool
                    resourcePoolFactory.getResourcePoolExpanded(resourcePoolUniqueKey)
                        .then(resourcePool => {

                            if (typeof resourcePool === 'undefined' || resourcePool === null) {
                                scope.errorMessage = 'Invalid CMRP';
                                return;
                            }

                            // It returns an array, set the first item in the list
                            scope.resourcePool = resourcePool;

                            if (scope.resourcePool.selectedElement() !== null) {
                                loadChartData();
                            }
                        })
                        .catch(() => {
                            // TODO scope.errorMessage ?
                        })
                        .finally(() => {
                            scope.chartConfig.loading = false;
                        });
                }
            }

            function loadChartData() {

                // Current element
                var element = scope.resourcePool.selectedElement();
                var chartData = null;

                if (element === null) {
                    return;
                }

                // Item length check
                if (element.ElementItemSet.length > 20) {
                    return;
                }

                scope.chartConfig.title = { text: element.Name };
                scope.chartConfig.series = [];

                if (scope.displayIndexDetails) {

                    // Pie type
                    scope.chartConfig.title = { text: 'Indexes' };
                    scope.chartConfig.options.chart = { type: 'pie' };
                    scope.chartConfig.options.yAxis.title = { text: '' };

                    chartData = [];
                    element.elementFieldIndexSet().forEach(elementFieldIndex => {
                        var chartItem = new ElementFieldIndexChartItem(elementFieldIndex);
                        chartData.push(chartItem);
                    });
                    scope.chartConfig.series = [{ data: chartData }];

                } else {

                    scope.chartConfig.title = { text: element.Name };

                    // TODO Check this rule?
                    if (element === element.ResourcePool.mainElement() && (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

                        // Column type
                        scope.chartConfig.options.chart = { type: 'column' };
                        scope.chartConfig.options.yAxis.title = { text: 'Total Income' };

                        element.ElementItemSet.forEach(elementItem => {
                            var chartItem = new ColumnChartItem(elementItem);
                            scope.chartConfig.series.push(chartItem);
                        });
                    } else {

                        // Pie type
                        scope.chartConfig.options.chart = { type: 'pie' };
                        scope.chartConfig.options.yAxis.title = { text: '' };

                        chartData = [];
                        element.ElementItemSet.forEach(elementItem => {
                            elementItem.ElementCellSet.forEach(elementCell => {
                                if (elementCell.ElementField.IndexEnabled) {
                                    var chartItem = new PieChartItem(elementCell);
                                    chartData.push(chartItem);
                                }
                            });
                        });
                        scope.chartConfig.series = [{ data: chartData }];
                    }
                }
            }

            function resetElementCellNumericValue(cell: any);
            function resetElementCellNumericValue(cell) {
                resourcePoolFactory.updateElementCellDecimalValue(cell, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueReset', cell);
                saveChanges();
            }

            function resetElementMultiplier(element: any);
            function resetElementMultiplier(element) {
                resourcePoolFactory.updateElementMultiplier(element, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
                saveChanges();
            }

            function resetIndexRating(field: any);
            function resetIndexRating(field) {
                resourcePoolFactory.updateElementFieldIndexRating(field, 'reset');
                saveChanges();
            }

            function resetResourcePoolRate() {
                resourcePoolFactory.updateResourcePoolRate(scope.resourcePool, 'reset');
                saveChanges();
            }

            function saveChanges() {
                dataContext.saveChanges(1500);
            }

            function saveChangesStart() {
                scope.isSaving = true;
            }

            function saveChangesCompleted() {
                scope.isSaving = false;
            }

            function toggleDescription() {
                scope.displayDescription = !scope.displayDescription;
            }

            // Index Details
            function toggleIndexDetails() {
                scope.displayIndexDetails = !scope.displayIndexDetails;
                loadChartData();
            }

            function currentUserChanged(event: any, newUser: any);
            function currentUserChanged(event, newUser) {
                initialize(newUser, scope.userName, scope.resourcePoolKey);
            }

            /* Chart objects */

            // TODO Store these in a better place?
            // TODO Also test these better, by comparing it with resourcePool.selectedElement() property!
            function ColumnChartItem(elementItem: any): void;
            function ColumnChartItem(elementItem) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return elementItem.Name;
                    }
                });

                Object.defineProperty(self, "data", {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return [elementItem.totalIncome()];
                    }
                });
            }

            function ElementFieldIndexChartItem(elementFieldIndex: any): void;
            function ElementFieldIndexChartItem(elementFieldIndex) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get() { return elementFieldIndex.Name; }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get() {
                        var indexRating = elementFieldIndex.indexRating();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(indexRating.toFixed(2));
                    }
                });
            }

            function PieChartItem(elementCell: any): void;
            function PieChartItem(elementCell) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return elementCell.ElementItem.Name;
                    }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get() {
                        var numericValue = elementCell.numericValue();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(numericValue.toFixed(2));
                    }
                });
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/_system/js/app/directives/resourcePoolEditor/resourcePoolEditor.html?v=0.62.0',
            scope: {
                config: '='
            },
            link: link
        };
    }

    angular.module('main').directive(directiveId, ['dataContext', 'Enums', 'logger', 'resourcePoolFactory', '$location', '$rootScope', resourcePoolEditor]);
}