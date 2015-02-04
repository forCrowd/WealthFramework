(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomEditController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            'userService',
            '$routeParams',
            '$rootScope',
            'logger',
            resourcePoolCustomEditController]);

    function resourcePoolCustomEditController(resourcePoolService,
        userService,
		$routeParams,
		$rootScope,
        logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // vm
        var vm = this;
        vm.userId = 0;
        vm.resourcePool = null;
        vm.chartConfig = {
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
            }
        };

        // Get userId and initialize
        userService.getUserInfo()
            .then(function (userInfo) {
                // TODO Obsolete?
                vm.userId = userInfo.Id;
                initialize(userInfo.Id);
            });

        function initialize(currentUserId) {

            // Event handlers
            // TODO 'Does the event belongs to me' check?
            $rootScope.$on('resourcePoolCurrentElementChanged', function () {
                loadChartData(vm.resourcePool.currElement());
            });
            $rootScope.$on('elementMultiplierIncreased', saveChanges);
            $rootScope.$on('elementMultiplierDecreased', saveChanges);
            $rootScope.$on('elementMultiplierReset', saveChanges);
            $rootScope.$on('indexRatingIncreased', saveChanges);
            $rootScope.$on('indexRatingDecreased', saveChanges);

            // Get the current resource pool
            resourcePoolService.getResourcePoolCustomEdit($routeParams.Id)
                .then(function (data) {
                    vm.resourcePool = data[0];
                    vm.resourcePool.currentUserId = currentUserId;
                    loadChartData(vm.resourcePool.currElement());
                })
                .catch(function (error) {
                    // TODO User-friendly message?
                });
        }

        function loadChartData(element) {

            vm.chartConfig.title = { text: element.Name };
            vm.chartConfig.options.chart = { type: element.resourcePoolField() ? 'column' : 'pie' };
            vm.chartConfig.options.yAxis.title = { text: element.resourcePoolField() ? 'Total Income' : '' };
            vm.chartConfig.series = [];

            if (element.resourcePoolField()) {
                // Column type
                for (var i = 0; i < element.ElementItemSet.length; i++) {
                    var elementItem = element.ElementItemSet[i];
                    var item = new columnChartItem(elementItem);
                    vm.chartConfig.series.push(item);
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
                vm.chartConfig.series = [{ data: chartData }];
            }
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
    };
})();
