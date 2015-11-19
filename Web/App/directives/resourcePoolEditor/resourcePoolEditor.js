(function () {
    'use strict';

    var directiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(directiveId, ['resourcePoolFactory',
            'userFactory',
            'Enums',
            '$rootScope',
            '$uibModal',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolFactory,
        userFactory,
        Enums,
        $rootScope,
        $uibModal,
        logger) {

        // Logger
        logger = logger.forSource(directiveId);

        function link(scope, elm, attrs) {

            scope.resourcePool = null;
            scope.isSaving = false;
            scope.errorMessage = '';

            scope.showEditorModal = showEditorModal;

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

            scope.$on('saveChangesStart', function () {
                scope.isSaving = true;
            });

            scope.$on('saveChangesCompleted', function () {
                scope.isSaving = false;
            });

            scope.changeCurrentElement = function (element) {
                scope.resourcePool.CurrentElement = element;
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

            function showEditorModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '/App/directives/resourcePoolEditor/resourcePoolEditorModal.html?v=0.37x',
                    controllerAs: 'vm',
                    controller: resourcePoolEditorModalController,
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        resourcePool: function () {
                            return scope.resourcePool;
                        }
                    }
                });

                modalInstance.result.then(function () {

                    // Saved

                }, function (action) {

                    // Canceled
                    logger.log('Modal dismissed at: ' + new Date());
                });

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

                // New
                if (scope.resourcePoolId === '0') {

                    resourcePoolFactory.createResourcePoolBasic()
                        .then(function (resourcePool) {
                            scope.resourcePool = resourcePool;
                            scope.showEditorModal();
                        })
                        .catch(function () { })
                        .finally(function () {
                            scope.chartConfig.loading = false;
                        });

                } else { // Existing
                    resourcePoolFactory.getResourcePoolExpanded(scope.resourcePoolId)
                            .then(function (resourcePool) {

                                if (resourcePool === null) {
                                    scope.errorMessage = 'Invalid CMRP Id';
                                    return;
                                }

                                // It returns an array, set the first item in the list
                                scope.resourcePool = resourcePool;

                                // Current element
                                if (scope.resourcePool.CurrentElement === null) {
                                    scope.changeCurrentElement(scope.resourcePool.MainElement);
                                } else {
                                    loadChartData();
                                }

                                // TODO Just for test, remove later
                                //scope.increaseElementMultiplier(scope.resourcePool.MainElement);

                                //for (var i = 0; i < scope.resourcePool.MainElement.ElementFieldSet.length; i++) {
                                //    var field = scope.resourcePool.MainElement.ElementFieldSet[i];
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
            }

            function loadChartData() {

                // Current element
                var element = scope.resourcePool.CurrentElement;

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
                    if (element === element.ResourcePool.MainElement && (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

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

            function resourcePoolEditorModalController($location, logger, $uibModalInstance, resourcePool) {

                var vm = this;
                vm.addElement = addElement;
                vm.addElementField = addElementField;
                vm.addElementItem = addElementItem;
                vm.cancelElementCell = cancelElementCell;
                vm.cancelResourcePool = cancelResourcePool;
                vm.editElement = editElement;
                vm.editElementCell = editElementCell;
                vm.editElementField = editElementField;
                vm.editElementItem = editElementItem;
                vm.element = null;
                vm.elementCell = null;
                vm.elementCellMaster = null;
                vm.elementCellSet = elementCellSet;
                vm.elementField = null;
                vm.elementFieldSet = elementFieldSet;
                vm.elementItem = null;
                vm.elementItemSet = elementItemSet;
                vm.isElementEdit = false;
                vm.isElementFieldEdit = false;
                vm.isElementItemEdit = false;
                vm.isNew = $location.path() === '/manage/resourcePool/0';
                vm.isSaveEnabled = isSaveEnabled;
                vm.isSaving = false;
                vm.entityErrors = [];
                vm.removeElement = removeElement;
                vm.removeElementField = removeElementField;
                vm.removeElementItem = removeElementItem;
                vm.resourcePool = resourcePool;
                vm.saveResourcePool = saveResourcePool;
                vm.saveElement = saveElement;
                vm.saveElementCell = saveElementCell;
                vm.saveElementField = saveElementField;
                vm.saveElementItem = saveElementItem;

                // Enums
                vm.ElementFieldType = Enums.ElementFieldType;
                vm.IndexType = Enums.IndexType;
                vm.IndexRatingSortType = Enums.IndexRatingSortType;

                function addElement() {
                    vm.element = { ResourcePool: vm.resourcePool, Name: 'New element' };
                    vm.isElementEdit = true;
                }

                function addElementField() {

                    var element = vm.resourcePool.ElementSet[0];

                    // A temp fix for default value of 'SortOrder'
                    // Later handle 'SortOrder' by UI, not by asking
                    var sortOrder = element.ElementFieldSet.length + 1;

                    vm.elementField = { Element: element, Name: 'New field', ElementFieldType: 1, SortOrder: sortOrder };
                    vm.isElementFieldEdit = true;
                }

                function addElementItem() {
                    vm.elementItem = { Element: vm.resourcePool.ElementSet[0], Name: 'New item' };
                    vm.isElementItemEdit = true;
                }

                function cancelElementCell() {

                    //logger.log('vm.elementCell', vm.elementCell.value());
                    //logger.log('vm.elementCellMaster', vm.elementCellMaster.value());

                    logger.log('vm.elementCell', vm.elementCell.UserElementCellSet[0].StringValue);
                    logger.log('vm.elementCellMaster', vm.elementCellMaster.UserElementCellSet[0].StringValue);

                    // vm.elementCell = angular.copy(vm.elementCellMaster);
                    vm.elementCell = resourcePoolFactory.copyElementCell(vm.elementCellMaster);

                    vm.isElementCellEdit = false;
                    vm.elementCell = null;
                    vm.elementCellMaster = null;
                }

                function cancelResourcePool() {

                    if (vm.isNew) {
                        resourcePoolFactory.removeResourcePool(vm.resourcePool);
                    }

                    $uibModalInstance.dismiss('cancel', vm.resourcePool);

                    if (vm.isNew) {
                        $location.path('/manage/resourcePool');
                    }
                }

                function editElement(element) {
                    vm.element = element;
                    vm.isElementEdit = true;
                }

                function editElementCell(elementCell) {
                    // vm.elementCell = elementCell;

                    //elementCell.test = 't1';

                    //vm.elementCellMaster = resourcePoolFactory.copyElementCell(elementCell);
                    // vm.elementCell = angular.copy(elementCell);
                    vm.elementCellMaster = elementCell;
                    vm.elementCell = resourcePoolFactory.copyElementCell(elementCell);

                    // logger.log('vm.elementCell', vm.elementCell);

                    logger.log('vm.elementCell', vm.elementCell.UserElementCellSet[0].StringValue);
                    logger.log('vm.elementCellMaster', vm.elementCellMaster.UserElementCellSet[0].StringValue);

                    vm.isElementCellEdit = true;
                }

                function editElementField(elementField) {
                    vm.elementField = elementField;
                    vm.isElementFieldEdit = true;
                }

                function editElementItem(elementItem) {
                    vm.elementItem = elementItem;
                    vm.isElementItemEdit = true;
                }

                function elementCellSet() {

                    var elementItems = elementItemSet();

                    var list = [];
                    for (var i = 0; i < elementItems.length; i++) {
                        var elementItem = elementItems[i];
                        for (var i2 = 0; i2 < elementItem.ElementCellSet.length; i2++) {
                            list.push(elementItem.ElementCellSet[i2]);
                        }
                    }
                    return list;
                }

                function elementFieldSet() {
                    var list = [];
                    for (var i = 0; i < vm.resourcePool.ElementSet.length; i++) {
                        var element = vm.resourcePool.ElementSet[i];
                        for (var i2 = 0; i2 < element.ElementFieldSet.length; i2++) {
                            list.push(element.ElementFieldSet[i2]);
                        }
                    }
                    return list;
                }

                function elementItemSet() {
                    var list = [];
                    for (var i = 0; i < vm.resourcePool.ElementSet.length; i++) {
                        var element = vm.resourcePool.ElementSet[i];
                        for (var i2 = 0; i2 < element.ElementItemSet.length; i2++) {
                            list.push(element.ElementItemSet[i2]);
                        }
                    }
                    return list;
                }

                function isSaveEnabled() {
                    //var value = vm.isSaving || (!vm.isNew && !resourcePoolFactory.hasChanges());

                    // logger.log('form', vm.resourcePoolForm);
                    // logger.log('form', vm.resourcePoolForm.$valid);

                    var value = !vm.isSaving
                        && typeof vm.resourcePoolForm !== 'undefined'
                        && vm.resourcePoolForm.$valid;

                    return value;
                }

                function removeElement(element) {
                    resourcePoolFactory.removeElement(element);
                }

                function removeElementField(elementField) {
                    resourcePoolFactory.removeElementField(elementField);
                }

                function removeElementItem(elementItem) {
                    resourcePoolFactory.removeElementItem(elementItem);
                }

                function saveElement() {

                    // New
                    if (typeof vm.element.entityAspect === 'undefined') {
                        resourcePoolFactory.createElement(vm.element);
                    }

                    vm.isElementEdit = false;
                    vm.element = null;
                }

                function saveElementCell() {
                    
                    var originalElementCell;
                    angular.forEach(vm.resourcePool.ElementSet, function (element) {
                        angular.forEach(element.ElementItemSet, function (item) {
                            angular.forEach(item.ElementCellSet, function (cell) {
                                if (originalElementCell !== null && cell.Id === vm.elementCell.Id) {
                                    originalElementCell = cell;
                                }
                            });
                        });
                    });

                    //vm.elementCell.test = 't2';

                    //logger.log('vm.elementCell', vm.elementCell.value());
                    //logger.log('vm.elementCellMaster', vm.elementCellMaster.value());
                    logger.log('vm.elementCell a', vm.elementCell.UserElementCellSet[0].StringValue);
                    logger.log('vm.elementCellMaster a', vm.elementCellMaster.UserElementCellSet[0].StringValue);
                    logger.log('originalElementCell a', originalElementCell.UserElementCellSet[0].StringValue);

                    //vm.elementCellMaster = angular.copy(vm.elementCell);
                    // vm.elementCellMaster = resourcePoolFactory.copyElementCell(vm.elementCell);
                    vm.elementCellMaster = vm.elementCell;

                    logger.log('vm.elementCell b', vm.elementCell.UserElementCellSet[0].StringValue);
                    logger.log('vm.elementCellMaster b', vm.elementCellMaster.UserElementCellSet[0].StringValue);
                    logger.log('originalElementCell b', originalElementCell.UserElementCellSet[0].StringValue);

                    vm.isElementCellEdit = false;
                    vm.elementCell = null;
                    vm.elementCellMaster = null;
                }

                function saveElementField() {

                    // New
                    if (typeof vm.elementField.entityAspect === 'undefined') {
                        resourcePoolFactory.createElementField(vm.elementField);
                    }

                    // Fixes
                    // a. UseFixedValue must be null for String & Element types
                    if (vm.elementField.ElementFieldType === vm.ElementFieldType.String
                        || vm.elementField.ElementFieldType === vm.ElementFieldType.Element) {
                        vm.elementField.UseFixedValue = null;
                    }

                    // b. UseFixedValue must be 'true' for Multiplier type
                    if (vm.elementField.ElementFieldType === vm.ElementFieldType.Multiplier) {
                        vm.elementField.UseFixedValue = true;
                    }

                    vm.isElementFieldEdit = false;
                    vm.elementField = null;
                }

                function saveElementItem() {

                    // New
                    if (typeof vm.elementItem.entityAspect === 'undefined') {
                        resourcePoolFactory.createElementItem(vm.elementItem);
                    }

                    vm.isElementItemEdit = false;
                    vm.elementItem = null;
                }

                function saveResourcePool() {

                    vm.isSaving = true;
                    resourcePoolFactory.saveChanges()
                        .then(function (result) {

                            // Main element fix
                            if (vm.isNew && resourcePool.ElementSet.length > 0) {

                                resourcePool.MainElement = resourcePool.ElementSet[0];

                                resourcePoolFactory.saveChanges()
                                    .then(function (result) {

                                        $uibModalInstance.close();

                                        if (vm.isNew) {
                                            $location.path('/manage/resourcePool/' + vm.resourcePool.Id);
                                        }
                                    });
                            } else {
                                $uibModalInstance.close();

                                if (vm.isNew) {
                                    $location.path('/manage/resourcePool/' + vm.resourcePool.Id);
                                }
                            }
                        })
                        .catch(function (error) {
                            // Conflict (Concurrency exception)
                            if (typeof error.status !== 'undefined' && error.status === '409') {
                                // TODO Try to recover!
                            } else if (typeof error.entityErrors !== 'undefined') {
                                vm.entityErrors = error.entityErrors;
                            }
                        })
                        .finally(function () {
                            vm.isSaving = false;
                        });
                };
            };

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
            // TODO Also test these better, by comparing it with resourcePool.CurrentElement property!
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
            templateUrl: '/App/directives/resourcePoolEditor/resourcePoolEditor.html?v=0.37',
            scope: {
                resourcePoolId: '=',
                chartHeight: '='
            },
            link: link
        };
    };

})();
