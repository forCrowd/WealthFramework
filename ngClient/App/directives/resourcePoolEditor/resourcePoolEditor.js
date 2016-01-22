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
            scope.resourcePool = null;
            scope.resourcePoolId = null;

            // Functions
            scope.changeSelectedElement = changeSelectedElement;
            scope.decreaseElementCellNumericValue = decreaseElementCellNumericValue;
            scope.decreaseElementMultiplier = decreaseElementMultiplier;
            scope.decreaseIndexRating = decreaseIndexRating;
            scope.decreaseResourcePoolRate = decreaseResourcePoolRate;
            scope.increaseElementCellNumericValue = increaseElementCellNumericValue;
            scope.increaseElementMultiplier = increaseElementMultiplier;
            scope.increaseIndexRating = increaseIndexRating;
            scope.increaseResourcePoolRate = increaseResourcePoolRate;
            scope.resetElementCellNumericValue = resetElementCellNumericValue;
            scope.resetElementMultiplier = resetElementMultiplier;
            scope.resetIndexRating = resetIndexRating;
            scope.resetResourcePoolRate = resetResourcePoolRate;
            scope.toggleIndexDetails = toggleIndexDetails;

            // Event handlers
            scope.$watch('config', configChanged, true);
            scope.$on('saveChangesStart', saveChangesStart);
            scope.$on('saveChangesCompleted', saveChangesCompleted);
            scope.$on('userLoggedIn', userLoggedIn);
            scope.$on('userLoggedOut', userLoggedOut);

            // Initialize
            _init();

            /*** Implementations ***/

            function _init() {

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
            }

            function changeSelectedElement(element) {
                scope.resourcePool.selectedElement(element);
                loadChartData();
            }

            function configChanged() {
                scope.resourcePoolId = typeof scope.config.resourcePoolId === 'undefined' ? null : Number(scope.config.resourcePoolId);
                userFactory.getCurrentUser()
                    .then(function (currentUser) {
                        setCurrentUser(currentUser);
                    });
            }

            function decreaseElementCellNumericValue(cell) {
                userFactory.updateElementCellNumericValue(cell, 'decrease');
                saveChanges();
            }

            function decreaseElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
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

            function getResourcePool() {

                // Initialize
                _init();

                // Validate
                if (typeof scope.resourcePoolId === null) {
                    scope.errorMessage = 'CMRP Id cannot be null';
                    scope.chartConfig.loading = false;
                    return;
                }

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

                            // TODO Just for test, remove later
                            //scope.increaseElementMultiplier(scope.resourcePool.mainElement());

                            //scope.resourcePool.mainElement().ElementFieldSet.forEach(function(field) {
                            //    if (field.IndexEnabled) {
                            //        var cell1 = field.ElementCellSet[0];
                            //        scope.decreaseElementCellNumericValue(cell1);

                            //        var cell2 = field.ElementCellSet[1];
                            //        scope.decreaseElementCellNumericValue(cell2);

                            //        var cell3 = field.ElementCellSet[2];
                            //        scope.decreaseElementCellNumericValue(cell3);
                            //    }
                            //});

                        })
                        .catch(function () {
                            // TODO scope.errorMessage ?
                        })
                        .finally(function () {
                            scope.chartConfig.loading = false;
                        });
            }

            function increaseElementCellNumericValue(cell) {
                userFactory.updateElementCellNumericValue(cell, 'increase');
                saveChanges();
            }

            function increaseElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
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
                saveChanges();
            }

            function resetElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
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
                userFactory.getCurrentUser()
                    .then(function (currentUser) {
                        if (currentUser.isAuthenticated()) {
                            resourcePoolFactory.saveChanges(1500)
                                .catch(function (error) {
                                    // Conflict (Concurrency exception)
                                    if (typeof error.status !== 'undefined' && error.status === '409') {
                                        // TODO Try to recover!
                                    } else if (typeof error.entityErrors !== 'undefined') {
                                        // vm.entityErrors = error.entityErrors;
                                    }
                                });
                        }
                    });
            }

            function saveChangesStart() {
                scope.isSaving = true;
            }

            function saveChangesCompleted() {
                scope.isSaving = false;
            }

            function setCurrentUser(currentUser) {
                scope.currentUser = currentUser;
                getResourcePool();
            }

            // Index Details
            function toggleIndexDetails() {
                scope.displayIndexDetails = !scope.displayIndexDetails;
                loadChartData();
            }

            function userLoggedIn(event, currentUser) {
                setCurrentUser(currentUser);
            }

            function userLoggedOut() {
                setCurrentUser(null);
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
            templateUrl: '/App/directives/resourcePoolEditor/resourcePoolEditor.html?v=0.38',
            scope: {
                config: '='
            },
            link: link
        };
    }
})();
