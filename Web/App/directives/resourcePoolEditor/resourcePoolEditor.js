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

            scope.currentUser = null;
            scope.errorMessage = '';
            scope.isSaving = false;
            scope.resourcePool = null;
            scope.resourcePoolId = null;
            scope.editResourcePool = editResourcePool;

            // Initialize the chart
            initChart();

            // Config
            scope.$watch('config', function () {
                scope.resourcePoolId = typeof scope.config.resourcePoolId === 'undefined' ? null : Number(scope.config.resourcePoolId);

                userFactory.getCurrentUser()
                    .then(function (currentUser) {
                        scope.currentUser = currentUser;
                        getResourcePool();
                    });

            }, true);

            // User logged in & out
            scope.$on('userLoggedIn', function (currentUser) {
                scope.currentUser = currentUser;
                getResourcePool();
            });

            scope.$on('userLoggedOut', function () {
                scope.currentUser = null;
                getResourcePool();
            });

            scope.$on('saveChangesStart', function () {
                scope.isSaving = true;
            });

            scope.$on('saveChangesCompleted', function () {
                scope.isSaving = false;
            });

            scope.changeSelectedElement = function (element) {
                scope.resourcePool.selectedElement(element);
                loadChartData();
            }

            // Index Details
            scope.displayIndexDetails = false;
            scope.toggleIndexDetails = function () {
                scope.displayIndexDetails = !scope.displayIndexDetails;
                loadChartData();
            }

            scope.increaseElementMultiplier = function (element) {
                userFactory.updateElementMultiplier(element, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
                saveChanges();
            }

            scope.decreaseElementMultiplier = function (element) {
                userFactory.updateElementMultiplier(element, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
                saveChanges();
            }

            scope.resetElementMultiplier = function (element) {
                userFactory.updateElementMultiplier(element, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
                saveChanges();
            }

            scope.increaseElementCellNumericValue = function (cell) {
                userFactory.updateElementCellNumericValue(cell, 'increase');
                saveChanges();
            }

            scope.decreaseElementCellNumericValue = function (cell) {
                userFactory.updateElementCellNumericValue(cell, 'decrease');
                saveChanges();
            }

            scope.resetElementCellNumericValue = function (cell) {
                userFactory.updateElementCellNumericValue(cell, 'reset');
                saveChanges();
            }

            scope.increaseIndexRating = function (field) {
                userFactory.updateElementFieldIndexRating(field, 'increase');
                saveChanges();
            }

            scope.decreaseIndexRating = function (field) {
                userFactory.updateElementFieldIndexRating(field, 'decrease');
                saveChanges();
            }

            scope.resetIndexRating = function (field) {
                userFactory.updateElementFieldIndexRating(field, 'reset');
                saveChanges();
            }

            scope.increaseResourcePoolRate = function () {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'increase');
                saveChanges();
            }

            scope.decreaseResourcePoolRate = function () {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'decrease');
                saveChanges();
            }

            scope.resetResourcePoolRate = function () {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'reset');
                saveChanges();
            }

            function editResourcePool() {
                // TODO Instead of having fixed url here, broadcast an 'edit request'?
                $location.path('/resourcePool/' + scope.resourcePoolId + '/edit');
            }

            function initChart() {

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

            function getResourcePool() {

                // Clear previous error messages
                scope.errorMessage = '';

                // Initialize the chart
                initChart();

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

                            //for (var i = 0; i < scope.resourcePool.mainElement().ElementFieldSet.length; i++) {
                            //    var field = scope.resourcePool.mainElement().ElementFieldSet[i];
                            //    if (field.IndexEnabled) {
                            //        var cell1 = field.ElementCellSet[0];
                            //        scope.decreaseElementCellNumericValue(cell1);

                            //        var cell2 = field.ElementCellSet[1];
                            //        scope.decreaseElementCellNumericValue(cell2);

                            //        var cell3 = field.ElementCellSet[2];
                            //        scope.decreaseElementCellNumericValue(cell3);
                            //    }
                            //}

                        })
                        .catch(function () {
                            // TODO scope.errorMessage ?
                        })
                        .finally(function () {
                            scope.chartConfig.loading = false;
                        });
            }

            function loadChartData() {

                // Current element
                var element = scope.resourcePool.selectedElement();

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

                    var chartData = [];
                    for (var i = 0; i < element.elementFieldIndexSet().length; i++) {
                        var elementFieldIndex = element.elementFieldIndexSet()[i];
                        var chartItem = new elementFieldIndexChartItem(elementFieldIndex);
                        chartData.push(chartItem);
                    }
                    scope.chartConfig.series = [{ data: chartData }];

                } else {

                    scope.chartConfig.title = { text: element.Name };

                    // TODO Check this rule?
                    if (element === element.ResourcePool.mainElement() && (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

                        // Column type
                        scope.chartConfig.options.chart = { type: 'column' };
                        scope.chartConfig.options.yAxis.title = { text: 'Total Income' };

                        for (var i = 0; i < element.ElementItemSet.length; i++) {
                            var elementItem = element.ElementItemSet[i];
                            var item = new columnChartItem(elementItem);
                            scope.chartConfig.series.push(item);
                        }
                    } else {

                        // Pie type
                        scope.chartConfig.options.chart = { type: 'pie' };
                        scope.chartConfig.options.yAxis.title = { text: '' };

                        var chartData = [];
                        for (var i = 0; i < element.ElementItemSet.length; i++) {
                            var elementItem = element.ElementItemSet[i];
                            for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                                var elementCell = elementItem.ElementCellSet[x];
                                if (elementCell.ElementField.IndexEnabled) {
                                    var chartItem = new pieChartItem(elementCell);
                                    chartData.push(chartItem);
                                }
                            }
                        }
                        scope.chartConfig.series = [{ data: chartData }];
                    }
                }
            }

            function saveChanges() {
                userFactory.isAuthenticated()
                    .then(function (isAuthenticated) {
                        if (isAuthenticated) {
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

            function elementFieldIndexChartItem(elementFieldIndex) {
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

            // TODO Store these in a better place?
            // TODO Also test these better, by comparing it with resourcePool.selectedElement() property!
            function columnChartItem(elementItem) {
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

            function pieChartItem(elementCell) {
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
            templateUrl: '/App/directives/resourcePoolEditor/resourcePoolEditor.html?v=0.37',
            scope: {
                config: '='
            },
            link: link
        };
    };

})();
