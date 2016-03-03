(function () {
    'use strict';

    var directiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(directiveId, ['resourcePoolFactory',
            'userFactory',
            'Enums',
            '$location',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolFactory,
        userFactory,
        Enums,
        $location,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(directiveId);

        function link(scope, elm, attrs) {

            // Local variables
            scope.currentUser = null;
            scope.displayIndexDetails = false;
            scope.editResourcePool = editResourcePool;
            scope.errorMessage = '';
            scope.isSaving = false;
            scope.resourcePool = { Name: 'Loading...' };
            scope.resourcePoolId = null;

            // Functions
            scope.changeSelectedElement = changeSelectedElement;
            scope.decreaseElementCellNumericValue = decreaseElementCellNumericValue;
            scope.decreaseElementMultiplier = decreaseElementMultiplier;
            scope.decreaseElementCellMultiplier = decreaseElementCellMultiplier;
            scope.decreaseIndexRating = decreaseIndexRating;
            scope.decreaseResourcePoolRate = decreaseResourcePoolRate;
            scope.increaseElementCellNumericValue = increaseElementCellNumericValue;
            scope.increaseElementMultiplier = increaseElementMultiplier;
            scope.increaseElementCellMultiplier = increaseElementCellMultiplier;
            scope.increaseIndexRating = increaseIndexRating;
            scope.increaseResourcePoolRate = increaseResourcePoolRate;
            scope.resetElementCellNumericValue = resetElementCellNumericValue;
            scope.resetElementMultiplier = resetElementMultiplier;
            scope.resetElementCellMultiplier = resetElementCellMultiplier;
            scope.resetIndexRating = resetIndexRating;
            scope.resetResourcePoolRate = resetResourcePoolRate;
            scope.toggleIndexDetails = toggleIndexDetails;

            // Event handlers
            scope.$watch('config', configChanged, true);
            scope.$on('saveChangesStart', saveChangesStart);
            scope.$on('saveChangesCompleted', saveChangesCompleted);
            scope.$on('userFactory_currentUserChanged', currentUserChanged);

            /*** Implementations ***/

            function changeSelectedElement(element) {
                scope.resourcePool.selectedElement(element);
                loadChartData();
            }

            function configChanged() {
                var resourcePoolId = typeof scope.config.resourcePoolId === 'undefined' ? null : Number(scope.config.resourcePoolId);
                userFactory.getCurrentUser()
                    .then(function (currentUser) {
                        initialize(currentUser, resourcePoolId);
                    });
            }

            function decreaseElementCellNumericValue(cell) {
                userFactory.updateElementCellNumericValue(cell, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueDecreased', cell);
                saveChanges();
            }

            function decreaseElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
                saveChanges();
            }

            function decreaseElementCellMultiplier(elementCell) {
                userFactory.updateElementCellMultiplier(elementCell, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementCellMultiplierDecreased', element);
                saveChanges();
            }

            function decreaseIndexRating(field) {
                userFactory.updateElementFieldIndexRating(field, 'decrease');
                saveChanges();
            }

            function decreaseResourcePoolRate() {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'decrease');
                saveChanges();
            }

            function editResourcePool() {
                // TODO Instead of having fixed url here, broadcast an 'edit request'?
                $location.url('/resourcePool/' + scope.resourcePoolId + '/edit');
            }

            function increaseElementCellNumericValue(cell) {
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueIncreased', cell);
                userFactory.updateElementCellNumericValue(cell, 'increase');
                saveChanges();
            }

            function increaseElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
                saveChanges();
            }

            function increaseElementCellMultiplier(elementCell) {
                userFactory.updateElementCellMultiplier(elementCell, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementCellMultiplierIncreased', element);
                saveChanges();
            }

            function increaseIndexRating(field) {
                userFactory.updateElementFieldIndexRating(field, 'increase');
                saveChanges();
            }

            function increaseResourcePoolRate() {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'increase');
                saveChanges();
            }

            function initialize(user, resourcePoolId) {

                if (scope.currentUser !== user || scope.resourcePoolId !== resourcePoolId) {
                    scope.currentUser = user;
                    scope.resourcePoolId = resourcePoolId;

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
                    if (scope.resourcePoolId === null) {
                        scope.errorMessage = 'CMRP Id cannot be null';
                        scope.chartConfig.loading = false;
                        return;
                    }

                    // Get resource pool
                    resourcePoolFactory.getResourcePoolExpanded(scope.resourcePoolId)
                            .then(function (resourcePool) {

                                if (resourcePool === null) {
                                    scope.errorMessage = 'Invalid CMRP Id';
                                    return;
                                }

                                // It returns an array, set the first item in the list
                                scope.resourcePool = resourcePool;

                                if (scope.resourcePool.selectedElement() !== null) {
                                    loadChartData();
                                }
                            })
                            .catch(function () {
                                // TODO scope.errorMessage ?
                            })
                            .finally(function () {
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
                    element.elementFieldIndexSet().forEach(function (elementFieldIndex) {
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

                        element.ElementItemSet.forEach(function (elementItem) {
                            var chartItem = new ColumnChartItem(elementItem);
                            scope.chartConfig.series.push(chartItem);
                        });
                    } else {

                        // Pie type
                        scope.chartConfig.options.chart = { type: 'pie' };
                        scope.chartConfig.options.yAxis.title = { text: '' };

                        chartData = [];
                        element.ElementItemSet.forEach(function (elementItem) {
                            elementItem.ElementCellSet.forEach(function (elementCell) {
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

            function resetElementCellNumericValue(cell) {
                userFactory.updateElementCellNumericValue(cell, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueReset', element);
                saveChanges();
            }

            function resetElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
                saveChanges();
            }

            function resetElementCellMultiplier(elementCell) {
                userFactory.updateElementCellMultiplier(elementCell, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementCellMultiplierReset', element);
                saveChanges();
            }

            function resetIndexRating(field) {
                userFactory.updateElementFieldIndexRating(field, 'reset');
                saveChanges();
            }

            function resetResourcePoolRate() {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'reset');
                saveChanges();
            }

            function saveChanges() {
                resourcePoolFactory.saveChanges(1500)
                    .catch(function (error) {
                        // Conflict (Concurrency exception)
                        if (typeof error.status !== 'undefined' && error.status === '409') {
                            // TODO Try to recover!
                        } else if (typeof error.entityErrors !== 'undefined') {
                            // config.entityErrors = error.entityErrors;
                        }
                    });
            }

            function saveChangesStart() {
                scope.isSaving = true;
            }

            function saveChangesCompleted() {
                scope.isSaving = false;
            }

            // Index Details
            function toggleIndexDetails() {
                scope.displayIndexDetails = !scope.displayIndexDetails;
                loadChartData();
            }

            function currentUserChanged(event, newUser) {
                initialize(newUser, scope.resourcePoolId);
            }

            /* Chart objects */

            // TODO Store these in a better place?
            // TODO Also test these better, by comparing it with resourcePool.selectedElement() property!
            function ColumnChartItem(elementItem) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return elementItem.Name;
                    }
                });

                Object.defineProperty(self, "data", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return [elementItem.totalIncome()];
                    }
                });
            }

            function ElementFieldIndexChartItem(elementFieldIndex) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementFieldIndex.Name; }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var indexRating = elementFieldIndex.indexRating();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(indexRating.toFixed(2));
                    }
                });
            }

            function PieChartItem(elementCell) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return elementCell.ElementItem.Name;
                    }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var numericValue = elementCell.numericValue();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(numericValue.toFixed(2));
                    }
                });
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/js/app/directives/resourcePoolEditor/resourcePoolEditor.html?v=0.48.0',
            scope: {
                config: '='
            },
            link: link
        };
    }
})();
