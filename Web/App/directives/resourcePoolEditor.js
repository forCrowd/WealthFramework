(function () {
    'use strict';

    var resourcePoolEditorDirectiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(resourcePoolEditorDirectiveId, ['resourcePoolService',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(resourcePoolEditorDirectiveId);

        function link(scope, elm, attrs) {

            scope.resourcePool = null;

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

            scope.increaseElementMultiplier = function (element) {
                element.increaseMultiplier();
                saveChanges();
            }

            scope.decreaseElementMultiplier = function (element) {
                element.decreaseMultiplier();
                saveChanges();
            }

            scope.resetElementMultiplier = function (element) {
                element.resetMultiplier();
                saveChanges();
            }

            // Initialize
            initialize();

            function initialize() {

                // Event handlers
                $rootScope.$on('resourcePool_currentElementChanged', function (event, resourcePool) {
                    if (resourcePool === scope.resourcePool) {
                        loadChartData(scope.resourcePool.currentElement);
                    }
                });

                //$rootScope.$on('element_multiplierIncreased', elementUpdatedEventHandler);
                //$rootScope.$on('element_multiplierDecreased', elementUpdatedEventHandler);
                //$rootScope.$on('element_multiplierReset', elementUpdatedEventHandler);
                $rootScope.$on('elementCell_indexRatingIncreased', elementCellUpdatedEventHandler);
                $rootScope.$on('elementCell_indexRatingDecreased', elementCellUpdatedEventHandler);

                // Get the current resource pool
                scope.$watch('resourcePoolId', function () {

                    resourcePoolService.getResourcePoolCustomEdit(scope.resourcePoolId)
                        .then(function (data) {
                            scope.resourcePool = data[0];

                            // Current element
                            if (scope.resourcePool.currentElement === null) {
                                logger.log('1');
                                for (var i = 0; i < scope.resourcePool.ElementSet.length; i++) {
                                    var element = scope.resourcePool.ElementSet[i];
                                    if (element.IsMainElement) {
                                        scope.resourcePool.currentElement = element;
                                        break;
                                    }
                                }
                            } else {
                                logger.log('2');
                                loadChartData(scope.resourcePool.currentElement);
                            }
                        })
                        .catch(function (error) {
                            // TODO User-friendly message?
                        });

                }, true);

                // Chart height
                scope.$watch('chartHeight', function () {
                    scope.chartConfig.size.height = scope.chartHeight;
                }, true);

            }

            //// Listen resource pool updated event
            //$rootScope.$on('resourcePool_ResourcePoolRateUpdated', resourcePoolUpdated);
            //$rootScope.$on('resourcePool_Saved', resourcePoolUpdated);

            //$rootScope.$on('element_MultiplierIncreased', elementUpdated);
            //$rootScope.$on('element_MultiplierDecreased', elementUpdated);
            //$rootScope.$on('element_MultiplierReset', elementUpdated);

            //function resourcePoolUpdated(event, resourcePoolId) {
            //    if (scope.resourcePoolId === resourcePoolId)
            //        getResourcePool();
            //}

            //function elementUpdated(event, elementId) {
            //    // TODO Can it be done through element.ResourcePool = resourcePool or somethin'?
            //    for (var i = 0; i < scope.resourcePool.ElementSet.length; i++) {
            //        if (scope.resourcePool.ElementSet[i].Id === elementId) {
            //            getResourcePool();
            //            break;
            //        }
            //    }
            //}

            function elementUpdatedEventHandler(event, element) {
                if (element.ResourcePool === scope.resourcePool) {
                    saveChanges();
                }
            }

            function elementCellUpdatedEventHandler(event, elementCell) {
                if (elementCell.ElementItem.Element.ResourcePool === scope.resourcePool) {
                    saveChanges();
                }
            }

            function loadChartData(element) {

                scope.chartConfig.loading = true;

                scope.chartConfig.title = { text: element.Name };
                scope.chartConfig.options.chart = { type: element.resourcePoolField() ? 'column' : 'pie' };
                scope.chartConfig.options.yAxis.title = { text: element.resourcePoolField() ? 'Total Income' : '' };
                scope.chartConfig.series = [];

                if (element.resourcePoolField()) {

                    // Column type
                    for (var i = 0; i < element.ElementItemSet.length; i++) {
                        var elementItem = element.ElementItemSet[i];
                        var item = new columnChartItem(elementItem);
                        scope.chartConfig.series.push(item);
                    }
                } else {

                    // Pie type
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

                scope.chartConfig.loading = false;

            }

            function saveChanges() {

                resourcePoolService.saveChanges()
                    .then(function (result) {

                    })
                    .catch(function (error) {
                        // Conflict (Concurrency exception)
                        if (error.status !== 'undefined' && error.status === '409') {
                            // TODO Try to recover!
                        } else if (error.entityErrors !== 'undefined') {
                            // vm.entityErrors = error.entityErrors;
                        }
                    })
                    .finally(function () {

                    });
            }

            // TODO Store these in a better place?
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
                    get: function () { return elementCell.ratingPercentage(); }
                });
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

})();
