(function () {
    'use strict';

    var resourcePoolEditorDirectiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(resourcePoolEditorDirectiveId, ['resourcePoolService',
            'userService',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService,
        userService,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(resourcePoolEditorDirectiveId);

        function link(scope, elm, attrs) {

            scope.resourcePool = null;
            scope.isAuthenticated = false;
            scope.errorMessage = '';

            // Resource pool id: Get the current resource pool
            scope.$watch('resourcePoolId', function () {
                getResourcePool();
            }, true);

            // Chart height
            scope.$watch('chartHeight', function () {
                scope.chartConfig.size.height = scope.chartHeight;
            }, true);

            // User logged in & out
            scope.$on('userLoggedIn', function () {
                getResourcePool();
            });

            scope.$on('userLoggedOut', function () {
                getResourcePool();
            });

            scope.changeCurrentElement = function (element) {
                scope.resourcePool.currentElement = element;
                loadChartData();
            }

            // Index Details
            scope.displayIndexDetails = false;
            scope.toggleIndexDetails = function () {
                scope.displayIndexDetails = !scope.displayIndexDetails;
                loadChartData();
            }

            scope.increaseElementMultiplier = function (element) {
                userService.updateElementMultiplier(element, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.decreaseElementMultiplier = function (element) {
                userService.updateElementMultiplier(element, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.resetElementMultiplier = function (element) {
                userService.updateElementMultiplier(element, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.increaseElementCellNumericValue = function (cell) {
                userService.updateElementCellNumericValue(cell, 'increase');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.decreaseElementCellNumericValue = function (cell) {
                userService.updateElementCellNumericValue(cell, 'decrease');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.resetElementCellNumericValue = function (cell) {
                userService.updateElementCellNumericValue(cell, 'reset');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.increaseIndexRating = function (field) {
                userService.updateElementFieldIndexRating(field, 'increase');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.decreaseIndexRating = function (field) {
                userService.updateElementFieldIndexRating(field, 'decrease');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.resetIndexRating = function (field) {
                userService.updateElementFieldIndexRating(field, 'reset');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.increaseResourcePoolRate = function () {
                userService.updateResourcePoolRate(scope.resourcePool, 'increase');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.decreaseResourcePoolRate = function () {
                userService.updateResourcePoolRate(scope.resourcePool, 'decrease');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            scope.resetResourcePoolRate = function () {
                userService.updateResourcePoolRate(scope.resourcePool, 'reset');
                if (scope.isAuthenticated) {
                    saveChanges();
                }
            }

            function initChart() {

                scope.chartConfig = {
                    loading: true,
                    title: { text: '' },
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
                        xAxis: { categories: [''] },
                        yAxis: {
                            allowDecimals: false,
                            min: 0
                        }
                    },
                    size: {}
                };
            }

            function getResourcePool() {

                // Clear previous error messages
                scope.errorMessage = '';

                // Initialize the chart
                initChart();

                // Validate
                if (typeof scope.resourcePoolId === 'undefined') {
                    scope.errorMessage = 'Undefined CMRP Id';
                    scope.chartConfig.loading = false;
                    return;
                }

                userService.getUserInfo()
                    .then(function (userInfo) {

                        scope.isAuthenticated = userInfo.Id > 0;

                        resourcePoolService.getResourcePoolExpanded(scope.resourcePoolId)
                                .then(loadResourcePool)
                                .catch(function () {
                                    // TODO scope.errorMessage ?
                                })
                                .finally(function () {
                                    scope.chartConfig.loading = false;
                                });
                    });
            }

            function loadResourcePool(resourcePoolSet) {

                if (resourcePoolSet.length === 0) {
                    scope.errorMessage = 'Invalid CMRP Id';
                    return;
                }

                // It returns an array, set the first item in the list
                scope.resourcePool = resourcePoolSet[0];

                // Current element
                if (scope.resourcePool.currentElement === null) {
                    scope.changeCurrentElement(scope.resourcePool.MainElement);
                } else {
                    loadChartData();
                }
            }

            function loadChartData() {

                // Current element
                var element = scope.resourcePool.currentElement;

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

                    if (element.directIncomeField()) {

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

                resourcePoolService.saveChanges(1500)
                    .then(function (result) {

                    })
                    .catch(function (error) {
                        // Conflict (Concurrency exception)
                        if (typeof error.status !== 'undefined' && error.status === '409') {
                            // TODO Try to recover!
                        } else if (typeof error.entityErrors !== 'undefined') {
                            // vm.entityErrors = error.entityErrors;
                        }
                    })
                    .finally(function () {

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
                    get: function () { return elementFieldIndex.indexRating(); }
                });
            }

            // TODO Store these in a better place?
            // TODO Also test these better, by comparing it with resourcePool.currentElement property!
            function columnChartItem(elementItem) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementItem.Name; }
                });

                Object.defineProperty(self, "data", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return [elementItem.totalIncome()]; }
                });
            }

            function pieChartItem(elementCell) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementCell.ElementItem.Name; }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementCell.numericValue(); }
                });
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/App/directives/resourcePoolEditor.html?v=029',
            scope: {
                resourcePoolId: '=',
                chartHeight: '='
            },
            link: link
        };
    };

})();
