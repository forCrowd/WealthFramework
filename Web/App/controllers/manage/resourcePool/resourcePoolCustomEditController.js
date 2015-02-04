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

        //Object.defineProperty(vm, "chartConfig", {
        //    enumerable: true,
        //    configurable: true,
        //    get: function () {
        //        return {
        //            // elementId: null,
        //            title: 'test',
        //            options: {
        //                chart: {
        //                    type: ''
        //                },
        //                plotOptions: {
        //                    column: {
        //                        allowPointSelect: true,
        //                        pointWidth: 15
        //                    },
        //                    pie: {
        //                        allowPointSelect: true,
        //                        cursor: 'pointer',
        //                        dataLabels: {
        //                            enabled: false
        //                        },
        //                        showInLegend: true
        //                    }
        //                },
        //                xAxis: { categories: [''] },
        //                yAxis: {
        //                    allowDecimals: false,
        //                    min: 0
        //                }
        //            }
        //        };
        //    }
        //});

        // Update Highchart data
        //vm.chartConfig.loading = true;

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

        function loadChartData(element) {

            logger.log('element', element);

            vm.chartConfig.title = element.Name;
            // vm.chartConfig.series = [];

            // Column type
            // if (vm.resourcePool.currElement().resourcePoolField()) {

            vm.chartConfig.options.chart.type = element.resourcePoolField() ? 'column' : 'pie';
            vm.chartConfig.options.yAxis.title = { text: element.resourcePoolField() ? 'Total Income' : '' };

            // vm.chartConfig = new chartConfigObj(vm.resourcePool, logger);

            // logger.log('vm.chartConfig', vm.chartConfig);

            // vm.chartConfig.series = getSeries(vm.resourcePool.currElement());

            //Object.defineProperty(vm.chartConfig, "series", {
            //    enumerable: true,
            //    configurable: true,
            //    get: function () {
            //        return getSeries(vm.)
            //    }
            //});

            //logger.log('vm.chartConfig', vm.chartConfig);
            //logger.log('vm.chartConfig.series', vm.chartConfig.series);

            vm.chartConfig.series = [];

            if (element.resourcePoolField()) {

                logger.log('here?');

                // Items
                for (var i = 0; i < element.ElementItemSet.length; i++) {
                    var elementItem = element.ElementItemSet[i];
                    var item = new columnChartItem(elementItem);
                    vm.chartConfig.series.push(item);
                }

                logger.log('series', vm.chartConfig.series);

            } else {

                logger.log('or here?');

                // Pie type
                //vm.chartConfig.options.chart.type = 'pie';
                //vm.chartConfig.options.yAxis.title = { text: '' };

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

                logger.log('series', vm.chartConfig.series);

            }
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

            $rootScope.$on('resourcePoolCurrentElementChanged', function () {

                loadChartData(vm.resourcePool.currElement());

                logger.log('hodooo!');

            });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                resourcePoolService.getResourcePoolCustomEdit($routeParams.Id)
                    .then(function (data) {

                        //logger.log('1');
                        vm.resourcePool = data[0];

                        loadChartData(vm.resourcePool.currElement());
                        //logger.log('3');

                        //for (var i = 0; i < vm.resourcePool.ElementSet.length; i++) {
                        //    var element = vm.resourcePool.ElementSet[i];
                        //    if (element.IsMainElement) {
                        //        vm.resourcePool.currentElement = element;
                        //        break;
                        //    }
                        //}

                        // Chart

                        //if (!vm.chartConfig.elementId
                        //    || vm.chartConfig.elementId !== vm.resourcePool.currElement().Id) {

                        //if (true) {

                            ////vm.chartConfig.resourcePoolId = resourcePool.Id;
                            //// vm.chartConfig.elementId = vm.resourcePool.currElement().Id;
                            //vm.chartConfig.title = vm.resourcePool.Name;
                            //// vm.chartConfig.series = [];

                            //// Column type
                            //// if (vm.resourcePool.currElement().resourcePoolField()) {

                            //vm.chartConfig.options.chart.type = vm.resourcePool.currElement().resourcePoolField() ? 'column' : 'pie';
                            //vm.chartConfig.options.yAxis.title = { text: vm.resourcePool.currElement().resourcePoolField() ? 'Total Income' : '' };

                            //vm.chartConfig = new chartConfigObj(vm.resourcePool, logger);

                            //logger.log('vm.chartConfig', vm.chartConfig);

                            // vm.chartConfig.series = getSeries(vm.resourcePool.currElement());

                            //Object.defineProperty(vm.chartConfig, "series", {
                            //    enumerable: true,
                            //    configurable: true,
                            //    get: function () {
                            //        return getSeries(vm.)
                            //    }
                            //});

                            //logger.log('vm.chartConfig', vm.chartConfig);
                            //logger.log('vm.chartConfig.series', vm.chartConfig.series);

                            //// Items
                            //for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                            //    var elementItem = vm.resourcePool.currElement().ElementItemSet[i];
                            //    var item = new columnChartItem(elementItem);
                            //    vm.chartConfig.series.push(item);
                            //}

                            //} else {

                            //    // Pie type
                            //    vm.chartConfig.options.chart.type = 'pie';
                            //    vm.chartConfig.options.yAxis.title = { text: '' };

                            //    var chartData = [];
                            //    for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                            //        var elementItem = vm.resourcePool.currElement().ElementItemSet[i];

                            //        for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                            //            var elementCell = elementItem.ElementCellSet[x];
                            //            if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                            //                var chartItem = new pieChartItem(elementCell);
                            //                chartData.push(chartItem);
                            //            }
                            //        }
                            //    }

                            //    vm.chartConfig.series = [{ data: chartData }];
                            //}
                        //} else {
                        //    if (vm.resourcePool.currElement().resourcePoolField()) {
                        //        for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                        //            var elementItem = vm.resourcePool.currElement().ElementItemSet[i];
                        //            var chartDataItem = vm.chartConfig.series[i];
                        //            chartDataItem.data = [elementItem.totalIncome()];
                        //        }
                        //    } else {
                        //        for (var i = 0; i < vm.resourcePool.currElement().ElementItemSet.length; i++) {
                        //            var elementItem = vm.resourcePool.currElement().ElementItemSet[i];

                        //            for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                        //                var elementCell = elementItem.ElementCellSet[x];

                        //                if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                        //                    var chartDataItem = vm.chartConfig.series[0].data[i];
                        //                    chartDataItem.y = elementCell.valuePercentage();
                        //                }
                        //            }
                        //        }
                        //    }
                        //}

                        //vm.chartConfig.loading = false;

                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function getSeries(element) {

            //logger.log('oyt?');

            // Items
            var seriesX = [];

            if (element.resourcePoolField()) {

                logger.log('rpf');

                for (var i = 0; i < element.ElementItemSet.length; i++) {
                    var elementItem = element.ElementItemSet[i];
                    var item = new columnChartItem(elementItem);
                    seriesX.push(item);
                }
            } else {

                logger.log('curr', element);

                //logger.log('no rpf');
                //logger.log('element.ElementItemSet.length', element.ElementItemSet.length);

                var seriesData = [];
                for (var i = 0; i < element.ElementItemSet.length; i++) {
                    var elementItem = element.ElementItemSet[i];

                    //logger.log('elementItem.ElementCellSet.length', elementItem.ElementCellSet.length);

                    for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                        var elementCell = elementItem.ElementCellSet[x];

                        //logger.log('elementCell', elementCell);
                        //logger.log('elementCell.ElementField.ElementFieldIndexSet.length', elementCell.ElementField.ElementFieldIndexSet.length);

                        if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                            var chartItem = new pieChartItem(elementCell);
                            seriesData.push(chartItem);
                        }
                    }
                }

                seriesX = [{ data: seriesData }];
            }

            logger.log('seriesX', seriesX);

            return seriesX;
            //return elementItem.Name;
        }

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

    function chartConfigObj(resourcePool, logger) {

        // var self = this;

        var self = {
            title: resourcePool.Name,
            options:
                {
                    chart: {
                        type: resourcePool.currElement().resourcePoolField() ? 'column' : 'pie'
                    },
                    yAxis: {
                        title: { text: resourcePool.currElement().resourcePoolField() ? 'Total Income' : '' }
                    }
                }
            //, series: [{ name: 'x', data: [1000] }]
        };

        self.series = [{ name: 'x2', data: [15] }];

        //self.elementId = vm.resourcePool.currElement().Id;
        //self.title = resourcePool.Name;
        // vm.chartConfig.series = [];

        // Column type
        // if (vm.resourcePool.currElement().resourcePoolField()) {

        //self.options.chart.type = resourcePool.currElement().resourcePoolField() ? 'column' : 'pie';
        //self.options.yAxis.title = { text: resourcePool.currElement().resourcePoolField() ? 'Total Income' : '' };
        // vm.chartConfig.series = getSeries(vm.resourcePool.currElement());

        //Object.defineProperty(self, "series3", {
        //    enumerable: true,
        //    configurable: true,
        //    get: function () {

        //        return [{ name: 'x3', data: [25] }];

        //        var seriesX = [];
        //        if (resourcePool.currElement().resourcePoolField()) {
        //            for (var i = 0; i < resourcePool.currElement().ElementItemSet.length; i++) {
        //                var elementItem = resourcePool.currElement().ElementItemSet[i];
        //                var item = new columnChartItem(elementItem);
        //                seriesX.push(item);
        //            }
        //        } else {
        //            var seriesData = [];
        //            for (var i = 0; i < resourcePool.currElement().ElementItemSet.length; i++) {
        //                var elementItem = resourcePool.currElement().ElementItemSet[i];
        //                for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
        //                    var elementCell = elementItem.ElementCellSet[x];
        //                    if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
        //                        var chartItem = new pieChartItem(elementCell);
        //                        seriesData.push(chartItem);
        //                    }
        //                }
        //            }
        //            seriesX = [{ data: seriesData }];
        //        }
        //        return seriesX;
        //    }
        //});

        logger.log('self.series', self.series);
        logger.log('self.series2', self.series2);

        return self;

    }

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
