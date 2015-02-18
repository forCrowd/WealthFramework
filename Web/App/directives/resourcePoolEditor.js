(function () {
    'use strict';

    var resourcePoolEditorDirectiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(resourcePoolEditorDirectiveId, ['resourcePoolService',
            'userService',
            //'elementService',
            //'userElementCellService',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService,
        userService,
        //elementService,
        //userElementCellService,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(resourcePoolEditorDirectiveId);

        function link(scope, elm, attrs) {

            scope.userId = 0;
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

            //scope.resourcePool = new Object();
            //scope.resourcePool.currentElement = null;

            ////scope.updateValueFilter = updateValueFilter;
            //scope.toggleValueFilter = function () {
            //    scope.valueFilter = scope.valueFilter === 1 ? 2 : 1;
            //    getResourcePool();
            //}

            //scope.valueFilterText = function () {
            //    return scope.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            //}

            //// Value filter
            //scope.valueFilter = 1;

            // Get userId and initialize
            userService.getUserInfo()
                .then(function (userInfo) {
                    // TODO Obsolete?
                    scope.userId = userInfo.Id;
                    initialize(userInfo.Id);
                });

            function initialize(currentUserId) {

                // Event handlers

                // TODO 'Does the event belongs to me' check?
                $rootScope.$on('resourcePool_currentElementChanged', function (event, resourcePool) {
                    if (resourcePool === scope.resourcePool) {
                        loadChartData(scope.resourcePool.currentElement());
                    }
                });

                //$rootScope.$on('element_valueFilterChanged', function (event, element) {
                //    if (element === scope.resourcePool.currentElement())
                //        loadChartData(element);
                //});

                $rootScope.$on('element_multiplierIncreased', elementUpdatedEventHandler);
                $rootScope.$on('element_multiplierDecreased', elementUpdatedEventHandler);
                $rootScope.$on('element_multiplierReset', elementUpdatedEventHandler);
                $rootScope.$on('elementCell_indexRatingIncreased', elementCellUpdatedEventHandler);
                $rootScope.$on('elementCell_indexRatingDecreased', elementCellUpdatedEventHandler);

                // Get the current resource pool
                scope.$watch('resourcePoolId', function () {

                    resourcePoolService.getResourcePoolCustomEdit(scope.resourcePoolId)
                        .then(function (data) {
                            scope.resourcePool = data[0];
                            scope.resourcePool.currentUserId = currentUserId;
                            loadChartData(scope.resourcePool.currentElement());
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
                if (element.resourcePool === scope.resourcePool) {
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
                    get: function () { return elementCell.valuePercentage(); }
                });
            }

            //function getResourcePool() {

            //    resourcePoolService.getResourcePoolCustom(scope.resourcePoolId, scope.valueFilter)
            //        .success(function (resourcePool) {

            //            // Resource pool
            //            scope.resourcePool = resourcePool;

            //            // ResourcePool functions
            //            resourcePool.updateResourcePoolRate = updateResourcePoolRate;

            //            // Elements
            //            for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
            //                var element = resourcePool.ElementSet[elementIndex];

            //                // Set current element
            //                if (!scope.resourcePool.currentElement && element.IsMainElement) {
            //                    // logger.log('getResourcePool - scope.resourcePool.currentElement', scope.resourcePool.currentElement);
            //                    scope.resourcePool.currentElement = element;
            //                }

            //                // Element functions
            //                element.increaseMultiplier = increaseMultiplier;
            //                element.decreaseMultiplier = decreaseMultiplier;
            //                element.resetMultiplier = resetMultiplier;

            //                // Fields
            //                for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {
            //                    var field = element.ElementFieldSet[fieldIndex];

            //                    // Field functions
            //                    if (field.ElementFieldType === 6) {
            //                        field.setCurrentElement = setCurrentElement;
            //                    }
            //                }

            //                // Items
            //                for (var i = 0; i < element.ElementItemSet.length; i++) {
            //                    var elementItem = element.ElementItemSet[i];

            //                    // Cells
            //                    for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
            //                        var elementCell = elementItem.ElementCellSet[x];

            //                        // Cell functions
            //                        if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
            //                            elementCell.increaseIndexCellValue = function () {
            //                                updateIndexCellValue(this, 'increase');
            //                            }

            //                            elementCell.decreaseIndexCellValue = function () {
            //                                updateIndexCellValue(this, 'decrease');
            //                            }
            //                        }
            //                    }
            //                }
            //            }

            //            loadChart();
            //        });

            //    function setCurrentElement() {
            //        scope.resourcePool.currentElement = this.SelectedElement;
            //        logger.log('setCurrentElement - scope.resourcePool.currentElement', scope.resourcePool.currentElement);

            //        loadChart();

            //        // getResourcePool();
            //    }

            //    function updateResourcePoolRate(rate) {
            //        resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, rate);
            //    }

            //    function increaseMultiplier() {
            //        elementService.increaseMultiplier(this.Id);
            //    }

            //    function decreaseMultiplier() {
            //        elementService.decreaseMultiplier(this.Id);
            //    }

            //    function resetMultiplier() {
            //        elementService.resetMultiplier(this.Id);
            //    }

            //    function updateIndexCellValue(elementCell, type) {

            //        userElementCellService.getUserElementCellSetByElementCellId(elementCell.Id, true)
            //            .then(function (userElementCellSet) {

            //                var userElementCell = null;

            //                if (userElementCellSet.length > 0) {
            //                    userElementCell = userElementCellSet[0];
            //                    userElementCell.DecimalValue = type === 'increase'
            //                        ? userElementCell.DecimalValue + 10
            //                        : userElementCell.DecimalValue - 10;
            //                }
            //                else {
            //                    // TODO UserId?
            //                    userElementCell.ElementCellId = elementCell.Id;
            //                    userElementCell.DecimalValue = type === 'increase' // TODO ?
            //                        ? 55
            //                        : 45;
            //                    userElementCellService.createUserElementCell(userElementCell);
            //                }

            //                userElementCellService.saveChanges()
            //                    .then(function () {
            //                        getResourcePool();
            //                    });
            //            });
            //    }
            //}

            //function loadChart() {
            //    // Update Highchart data
            //    scope.chartConfig.loading = true;

            //    // New or existing?
            //    //if (typeof scope.chartConfig.resourcePoolId === 'undefined'
            //    //    || scope.chartConfig.resourcePoolId !== resourcePool.Id) {

            //    if (!scope.chartConfig.elementId
            //        || scope.chartConfig.elementId !== scope.resourcePool.currentElement.Id) {

            //        //scope.chartConfig.resourcePoolId = resourcePool.Id;
            //        scope.chartConfig.elementId = scope.resourcePool.currentElement.Id;
            //        scope.chartConfig.title = scope.resourcePool.Name;
            //        scope.chartConfig.series = [];

            //        // Column type
            //        if (scope.resourcePool.currentElement.HasResourcePoolField) {

            //            scope.chartConfig.options.chart.type = 'column';
            //            scope.chartConfig.options.yAxis.title = { text: 'Total Income' };

            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];
            //                var chartDataItem = {
            //                    name: elementItem.Name,
            //                    data: [elementItem.TotalIncome]
            //                };
            //                scope.chartConfig.series.push(chartDataItem);
            //            }
            //        } else {

            //            // Pie type
            //            scope.chartConfig.options.chart.type = 'pie';
            //            scope.chartConfig.options.yAxis.title = { text: '' };

            //            var chartData = [];
            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];

            //                for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
            //                    var elementCell = elementItem.ElementCellSet[x];

            //                    if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
            //                        var chartDataItem = {
            //                            name: elementItem.Name,
            //                            y: elementCell.ValuePercentage
            //                        };
            //                        chartData.push(chartDataItem);
            //                    }
            //                }
            //            }

            //            scope.chartConfig.series = [{ data: chartData }];
            //        }
            //    } else {
            //        if (scope.resourcePool.currentElement.HasResourcePoolField) {
            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];
            //                var chartDataItem = scope.chartConfig.series[i];
            //                chartDataItem.data = [elementItem.TotalIncome];
            //            }
            //        } else {
            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];

            //                for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
            //                    var elementCell = elementItem.ElementCellSet[x];

            //                    if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
            //                        var chartDataItem = scope.chartConfig.series[0].data[i];
            //                        chartDataItem.y = elementCell.ValuePercentage;
            //                    }
            //                }
            //            }
            //        }
            //    }

            //    scope.chartConfig.loading = false;

            //}
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
