(function () {
    'use strict';

    var directiveId = 'resourcePoolEditor';
    angular.module('main')
        .directive(directiveId, ['resourcePoolService',
            'userElementCellService',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService, userElementCellService, $rootScope, logger) {
        logger = logger.forSource(directiveId);

        function link(scope, element, attrs) {

            scope.resourcePool = null;
            scope.chartConfig = null;
            scope.decreaseMultiplier = decreaseMultiplier;
            scope.increaseMultiplier = increaseMultiplier;
            scope.resetMultiplier = resetMultiplier;
            scope.updateResourcePoolRate = updateResourcePoolRate;

            initialize();

            function initialize() {

                // Highchart initial config
                scope.chartConfig = {
                    options: {
                        chart: {
                            type: 'column'
                            , height: 250
                        },
                        yAxis: {
                            min: 0,
                            allowDecimals: false
                        },
                        xAxis: { categories: [''] },
                        plotOptions: {
                            column: {
                                pointWidth: 15
                            }
                        }
                    }
                }

                // List resourcePoolId property change
                scope.$watch('resourcePoolId', function () {
                    getResourcePool();
                }, true);

                // Listen resource pool updated event
                $rootScope.$on('resourcePool_MultiplierIncreased', resourcePoolUpdated);
                $rootScope.$on('resourcePool_MultiplierDecreased', resourcePoolUpdated);
                $rootScope.$on('resourcePool_MultiplierReset', resourcePoolUpdated);
                $rootScope.$on('resourcePool_ResourcePoolRateUpdated', resourcePoolUpdated);
                $rootScope.$on('resourcePool_Saved', resourcePoolUpdated);

                function resourcePoolUpdated(event, resourcePoolId) {
                    if (scope.resourcePoolId === resourcePoolId)
                        getResourcePool();
                }
            }

            function getResourcePool() {

                resourcePoolService.getResourcePoolCustom(scope.resourcePoolId)
                    .success(function (resourcePool) {
                        scope.resourcePool = resourcePool;

                        angular.forEach(scope.resourcePool.MainElement.ElementItemSet, function (elementItem) {
                            angular.forEach(elementItem.ElementCellSet, function (elementCell) {
                                if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {

                                    elementCell.increaseIndexCellValue = function () {
                                        updateIndexCellValue(elementCell, 'increase');
                                    }

                                    elementCell.decreaseIndexCellValue = function () {
                                        updateIndexCellValue(elementCell, 'decrease');
                                    }
                                }
                            });
                        })

                        // Update Highchart data
                        scope.chartConfig.loading = true;

                        // New or existing?
                        if (typeof scope.chartConfig.resourcePoolId === 'undefined'
                            || scope.chartConfig.resourcePoolId !== resourcePool.Id) {

                            scope.chartConfig.resourcePoolId = resourcePool.Id;
                            scope.chartConfig.title = resourcePool.Name;
                            //scope.chartConfig.options.yAxis.title = { text: resourcePool.MainElement.MultiplierFieldName };
                            scope.chartConfig.options.yAxis.title = { text: 'Total Income' };
                            scope.chartConfig.series = [];

                            for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                                var elementItemChartData = {
                                    name: resourcePool.MainElement.ElementItemSet[i].Name,
                                    data: [resourcePool.MainElement.ElementItemSet[i].TotalIncome]
                                };
                                scope.chartConfig.series.push(elementItemChartData);
                            }
                        }
                        else {
                            for (var i = 0; i < resourcePool.MainElement.ElementItemSet.length; i++) {
                                scope.chartConfig.series[i].data = [resourcePool.MainElement.ElementItemSet[i].TotalIncome];
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
                                    //logger.logSuccess('Your changes have been saved!');
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
                resourcePoolId: '='
            },
            link: link
        };
    };

})();
