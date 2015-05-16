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

            // User logged in & out
            userService.getUserInfo()
                .then(function (userInfo) {
                    scope.isAuthenticated = true;
                });
            $rootScope.$on('userLoggedIn', function () {
                scope.isAuthenticated = true;
            });
            $rootScope.$on('userLoggedOut', function () {
                scope.isAuthenticated = false;
            });

            scope.chartConfig = {
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
                var result = resourcePoolService.updateElementMultiplier(element, 'increase');
                if (result) {
                    $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
                    saveChanges();
                }
            }

            scope.decreaseElementMultiplier = function (element) {
                var result = resourcePoolService.updateElementMultiplier(element, 'decrease');
                if (result) {
                    $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
                    saveChanges();
                }
            }

            scope.resetElementMultiplier = function (element) {
                var result = resourcePoolService.updateElementMultiplier(element, 'reset');
                if (result) {
                    $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
                    saveChanges();
                }
            }

            scope.increaseCellIndexRating = function (cell) {
                var result = resourcePoolService.updateElementCellIndexRating(cell, 'increase');
                if (result) {
                    saveChanges();
                }
            }

            scope.decreaseCellIndexRating = function (cell) {
                var result = resourcePoolService.updateElementCellIndexRating(cell, 'decrease');
                if (result) {
                    saveChanges();
                }
            }

            scope.increaseIndexRating = function (index) {
                var result = resourcePoolService.updateElementFieldIndexRating(index, 'increase');
                if (result) {
                    saveChanges();
                }
            }

            scope.decreaseIndexRating = function (index) {
                var result = resourcePoolService.updateElementFieldIndexRating(index, 'decrease');
                if (result) {
                    saveChanges();
                }
            }

            scope.increaseResourcePoolRate = function () {
                var result = resourcePoolService.updateResourcePoolRate(scope.resourcePool, 'increase');
                if (result) {
                    saveChanges();
                }
            }

            scope.decreaseResourcePoolRate = function () {
                var result = resourcePoolService.updateResourcePoolRate(scope.resourcePool, 'decrease');
                if (result) {
                    saveChanges();
                }
            }

            // Resource pool id: Get the current resource pool
            scope.$watch('resourcePoolId', function () {

                // Validate
                if (typeof scope.resourcePoolId === 'undefined') {
                    return;
                }

                if (scope.isAuthenticated) {
                    resourcePoolService.getResourcePoolExpandedWithUser(scope.resourcePoolId).then(loadResourcePool);
                } else {
                    resourcePoolService.getResourcePoolExpanded(scope.resourcePoolId).then(loadResourcePool);
                }

            }, true);

            function loadResourcePool(resourcePool) {

                scope.resourcePool = resourcePool[0];

                // Current element
                if (scope.resourcePool.currentElement === null) {
                    scope.changeCurrentElement(scope.resourcePool.mainElement());
                } else {
                    loadChartData();
                }
            }

            // Chart height
            scope.$watch('chartHeight', function () {
                scope.chartConfig.size.height = scope.chartHeight;
            }, true);

            function loadChartData() {

                // Current element
                var element = scope.resourcePool.currentElement;

                scope.chartConfig.loading = true;
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

                    if (element.resourcePoolField()) {

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
                                if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                                    var chartItem = new pieChartItem(elementCell);
                                    chartData.push(chartItem);
                                }
                            }
                        }
                        scope.chartConfig.series = [{ data: chartData }];
                    }
                }

                scope.chartConfig.loading = false;
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
                    get: function () { return elementCell.rating(); }
                });
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/App/directives/resourcePoolEditor.html?v=0191',
            scope: {
                resourcePoolId: '=',
                chartHeight: '='
            },
            link: link
        };
    };

})();
