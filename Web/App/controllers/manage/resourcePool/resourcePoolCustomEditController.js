(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomEditController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            'userService',
            '$location',
            '$routeParams',
            '$rootScope',
            //'$scope',
            'logger',
            resourcePoolCustomEditController]);

    function resourcePoolCustomEditController(resourcePoolService,
        userService,
		$location,
		$routeParams,
		$rootScope,
		//$scope,
        logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/resourcePool/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;

        vm.chartConfig = {
            elementId: null,
            options: {
                chart: {
                    type: ''
                },
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

        // Update Highchart data
        vm.chartConfig.loading = true;

        // New or existing?
        //if (typeof vm.chartConfig.resourcePoolId === 'undefined'
        //    || vm.chartConfig.resourcePoolId !== resourcePool.Id) {

        vm.resourcePool = null;
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.resourcePool = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;
        vm.userId = 0;

        userService.getUserInfo()
            .then(function (userInfo) {
                vm.userId = userInfo.Id;
                initialize();
            });

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/resourcePool');

            //if (resourcePoolService.hasChanges()) {
            //    resourcePoolService.rejectChanges();
            //    logWarning('Discarded pending change(s)', null, true);
            //}
        }

        function hasChanges() {
            return resourcePoolService.hasChanges();
        }

        function initialize() {

            //logger.log('scope', scope);

            //$scope.$watch('vm.resourcePool', function () {
            //    // getResourcePool();
            //    //logger.log('aha!');
            //}, true);


            //$rootScope.$on('elementMultiplierIncreased', function () {
            //    saveChanges();
            //});

            // Event handlers
            // TODO 'Does the event belongs to me' check?
            $rootScope.$on('elementMultiplierIncreased', saveChanges);
            $rootScope.$on('elementMultiplierDecreased', saveChanges);
            $rootScope.$on('elementMultiplierReset', saveChanges);
            $rootScope.$on('indexRatingIncreased', saveChanges);
            $rootScope.$on('indexRatingDecreased', saveChanges);

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                resourcePoolService.getResourcePoolCustomEdit($routeParams.Id)
                    .then(function (data) {

                        //logger.log('1');
                        vm.resourcePool = data[0];
                        //logger.log('3');

                        //for (var i = 0; i < vm.resourcePool.ElementSet.length; i++) {
                        //    var element = vm.resourcePool.ElementSet[i];
                        //    if (element.IsMainElement) {
                        //        vm.resourcePool.currentElement = element;
                        //        break;
                        //    }
                        //}

                        // Chart

                        if (!vm.chartConfig.elementId
                            || vm.chartConfig.elementId !== vm.resourcePool.currElement().Id) {

                            //vm.chartConfig.resourcePoolId = resourcePool.Id;
                            vm.chartConfig.elementId = vm.resourcePool.currElement().Id;
                            vm.chartConfig.title = vm.resourcePool.Name;
                            vm.chartConfig.series = [];

                            // Column type
                            if (vm.resourcePool.currElement().resourcePoolField()) {

                                vm.chartConfig.options.chart.type = 'column';
                                vm.chartConfig.options.yAxis.title = { text: 'Total Income' };

                                // Items
                                for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                                    var elementItem = vm.resourcePool.currElement().ElementItemSet[i];
                                    var item = new columnChartItem(elementItem);
                                    vm.chartConfig.series.push(item);
                                }

                            } else {

                                // Pie type
                                vm.chartConfig.options.chart.type = 'pie';
                                vm.chartConfig.options.yAxis.title = { text: '' };

                                var chartData = [];
                                for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                                    var elementItem = vm.resourcePool.currElement().ElementItemSet[i];

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
                        } else {
                            if (vm.resourcePool.currElement().resourcePoolField()) {
                                for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                                    var elementItem = vm.resourcePool.currElement().ElementItemSet[i];
                                    var chartDataItem = vm.chartConfig.series[i];
                                    chartDataItem.data = [elementItem.totalIncome()];
                                }
                            } else {
                                for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                                    var elementItem = vm.resourcePool.currElement().ElementItemSet[i];

                                    for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                                        var elementCell = elementItem.ElementCellSet[x];

                                        if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                                            var chartDataItem = vm.chartConfig.series[0].data[i];
                                            chartDataItem.y = elementCell.valuePercentage();
                                        }
                                    }
                                }
                            }
                        }

                        vm.chartConfig.loading = false;

                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !resourcePoolService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                resourcePoolService.createResourcePool(vm.resourcePool);
            } else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
                // Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                //var rowVersion = vm.resourcePool.RowVersion;
                //vm.resourcePool.RowVersion = '';
                //vm.resourcePool.RowVersion = rowVersion;
            }

            isSaving = true;
            resourcePoolService.saveChanges()
                .then(function (result) {
                    //$location.path('/manage/resourcePool');
                })
                .catch(function (error) {
                    // Conflict (Concurrency exception)
                    if (error.status !== 'undefined' && error.status === '409') {
                        // TODO Try to recover!
                    } else if (error.entityErrors !== 'undefined') {
                        vm.entityErrors = error.entityErrors;
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };

    // TODO Store these in a better place?
    function columnChartItem(elementItem) {
        var self = this;

        Object.defineProperty(self, "name", {
            enumerable: true,
            configurable: true,
            get: function () { return elementItem.Name; }
        });

        // Data property
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

        // Data property
        Object.defineProperty(self, "y", {
            enumerable: true,
            configurable: true,
            get: function () { return elementCell.valuePercentage(); }
        });
    }


})();
