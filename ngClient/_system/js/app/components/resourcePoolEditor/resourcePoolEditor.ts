//import { LoggerService } from "../../ng2/services/logger";

class ResourcePoolEditorController {

    static $inject = ["dataContext", "logger", "resourcePoolFactory", "$location", "$rootScope", "$scope"];

    constructor(dataContext: any, logger: any, resourcePoolFactory: any, $location: any, $rootScope: any, $scope: any) {

        var vm: any = this;

        // Scope variables
        vm.currentUser = null;
        vm.displayDescription = true;
        vm.displayIndexDetails = false;
        vm.errorMessage = "";
        vm.isSaving = false;
        vm.resourcePool = { Name: "Loading..." };
        vm.resourcePoolKey = "";
        vm.userName = "";

        // Functions
        vm.changeSelectedElement = changeSelectedElement;
        vm.decreaseElementCellNumericValue = decreaseElementCellNumericValue;
        vm.decreaseElementMultiplier = decreaseElementMultiplier;
        vm.decreaseIndexRating = decreaseIndexRating;
        vm.decreaseResourcePoolRate = decreaseResourcePoolRate;
        vm.editResourcePool = editResourcePool;
        vm.increaseElementCellNumericValue = increaseElementCellNumericValue;
        vm.increaseElementMultiplier = increaseElementMultiplier;
        vm.increaseIndexRating = increaseIndexRating;
        vm.increaseResourcePoolRate = increaseResourcePoolRate;
        vm.resetElementCellNumericValue = resetElementCellNumericValue;
        vm.resetElementMultiplier = resetElementMultiplier;
        vm.resetIndexRating = resetIndexRating;
        vm.resetResourcePoolRate = resetResourcePoolRate;
        vm.toggleDescription = toggleDescription;
        vm.toggleIndexDetails = toggleIndexDetails;

        // Event handlers
        $scope.$watch("config", configChanged, true);
        $scope.$on("saveChangesStart", saveChangesStart);
        $scope.$on("saveChangesCompleted", saveChangesCompleted);
        $scope.$on("dataContext_currentUserChanged", currentUserChanged);

        /*** Implementations ***/

        function changeSelectedElement(element: any) {
            vm.resourcePool.selectedElement(element);
            loadChartData();
        }

        function configChanged() {

            var userName = typeof vm.config.userName === "undefined" ? "" : vm.config.userName;
            var resourcePoolKey = typeof vm.config.resourcePoolKey === "undefined" ? "" : vm.config.resourcePoolKey;

            initialize(dataContext.getCurrentUser(), userName, resourcePoolKey);
        }

        function decreaseElementCellNumericValue(cell: any) {
            resourcePoolFactory.updateElementCellDecimalValue(cell, "decrease");
            $rootScope.$broadcast("resourcePoolEditor_elementCellNumericValueDecreased", cell);
            saveChanges();
        }

        function decreaseElementMultiplier(element: any) {
            resourcePoolFactory.updateElementMultiplier(element, "decrease");
            $rootScope.$broadcast("resourcePoolEditor_elementMultiplierDecreased", element);
            saveChanges();
        }

        function decreaseIndexRating(field: any) {
            resourcePoolFactory.updateElementFieldIndexRating(field, "decrease");
            saveChanges();
        }

        function decreaseResourcePoolRate() {
            resourcePoolFactory.updateResourcePoolRate(vm.resourcePool, "decrease");
            saveChanges();
        }

        function editResourcePool() {
            // TODO Instead of having fixed url here, broadcast an "edit request"?
            $location.url(vm.resourcePool.urlEdit());
        }

        function increaseElementCellNumericValue(cell: any) {
            resourcePoolFactory.updateElementCellDecimalValue(cell, "increase");
            $rootScope.$broadcast("resourcePoolEditor_elementCellNumericValueIncreased", cell);
            saveChanges();
        }

        function increaseElementMultiplier(element: any) {
            resourcePoolFactory.updateElementMultiplier(element, "increase");
            $rootScope.$broadcast("resourcePoolEditor_elementMultiplierIncreased", element);
            saveChanges();
        }

        function increaseIndexRating(field: any) {
            resourcePoolFactory.updateElementFieldIndexRating(field, "increase");
            saveChanges();
        }

        function increaseResourcePoolRate() {
            resourcePoolFactory.updateResourcePoolRate(vm.resourcePool, "increase");
            saveChanges();
        }

        function initialize(user: any, userName: any, resourcePoolKey: any) {

            if (vm.currentUser !== user || vm.userName !== userName || vm.resourcePoolKey !== resourcePoolKey) {
                vm.currentUser = user;
                vm.userName = userName;
                vm.resourcePoolKey = resourcePoolKey;

                // Clear previous error messages
                vm.errorMessage = "";

                vm.chartConfig = {
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
                                cursor: "pointer",
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        tooltip: {
                            headerFormat: ""
                        },
                        xAxis: { categories: [""] },
                        yAxis: {
                            allowDecimals: false,
                            min: 0
                        }
                    },
                    size: {},
                    title: { text: "" }
                };

                // Validate
                if (vm.userName === "" || vm.resourcePoolKey === "") {
                    vm.errorMessage = "CMRP Id cannot be null";
                    vm.chartConfig.loading = false;
                    return;
                }

                var resourcePoolUniqueKey = { userName: vm.userName, resourcePoolKey: vm.resourcePoolKey };

                // Get resource pool
                resourcePoolFactory.getResourcePoolExpanded(resourcePoolUniqueKey)
                    .then(resourcePool => {

                        if (typeof resourcePool === "undefined" || resourcePool === null) {
                            vm.errorMessage = "Invalid CMRP";
                            return;
                        }

                        // It returns an array, set the first item in the list
                        vm.resourcePool = resourcePool;

                        if (vm.resourcePool.selectedElement() !== null) {
                            loadChartData();
                        }
                    })
                    .catch(() => {
                        // TODO scope.errorMessage ?
                    })
                    .finally(() => {
                        vm.chartConfig.loading = false;
                    });
            }
        }

        function loadChartData() {

            // Current element
            var element = vm.resourcePool.selectedElement();
            var chartData = null;

            if (element === null) {
                return;
            }

            // Item length check
            if (element.ElementItemSet.length > 20) {
                return;
            }

            vm.chartConfig.title = { text: element.Name };
            vm.chartConfig.series = [];

            if (vm.displayIndexDetails) {

                // Pie type
                vm.chartConfig.title = { text: "Indexes" };
                vm.chartConfig.options.chart = { type: "pie" };
                vm.chartConfig.options.yAxis.title = { text: "" };

                chartData = [];
                element.elementFieldIndexSet()
                    .forEach(elementFieldIndex => {
                        var chartItem = new ElementFieldIndexChartItem(elementFieldIndex);
                        chartData.push(chartItem);
                    });
                vm.chartConfig.series = [{ data: chartData }];

            } else {

                vm.chartConfig.title = { text: element.Name };

                // TODO Check this rule?
                if (element === element.ResourcePool.mainElement() &&
                (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

                    // Column type
                    vm.chartConfig.options.chart = { type: "column" };
                    vm.chartConfig.options.yAxis.title = { text: "Total Income" };

                    element.ElementItemSet.forEach(elementItem => {
                        var chartItem = new ColumnChartItem(elementItem);
                        vm.chartConfig.series.push(chartItem);
                    });
                } else {

                    // Pie type
                    vm.chartConfig.options.chart = { type: "pie" };
                    vm.chartConfig.options.yAxis.title = { text: "" };

                    chartData = [];
                    element.ElementItemSet.forEach(elementItem => {
                        elementItem.ElementCellSet.forEach(elementCell => {
                            if (elementCell.ElementField.IndexEnabled) {
                                var chartItem = new PieChartItem(elementCell);
                                chartData.push(chartItem);
                            }
                        });
                    });
                    vm.chartConfig.series = [{ data: chartData }];
                }
            }
        }

        function resetElementCellNumericValue(cell: any) {
            resourcePoolFactory.updateElementCellDecimalValue(cell, "reset");
            $rootScope.$broadcast("resourcePoolEditor_elementCellNumericValueReset", cell);
            saveChanges();
        }

        function resetElementMultiplier(element: any) {
            resourcePoolFactory.updateElementMultiplier(element, "reset");
            $rootScope.$broadcast("resourcePoolEditor_elementMultiplierReset", element);
            saveChanges();
        }

        function resetIndexRating(field: any) {
            resourcePoolFactory.updateElementFieldIndexRating(field, "reset");
            saveChanges();
        }

        function resetResourcePoolRate() {
            resourcePoolFactory.updateResourcePoolRate(vm.resourcePool, "reset");
            saveChanges();
        }

        function saveChanges() {
            dataContext.saveChanges(1500);
        }

        function saveChangesStart() {
            vm.isSaving = true;
        }

        function saveChangesCompleted() {
            vm.isSaving = false;
        }

        function toggleDescription() {
            vm.displayDescription = !vm.displayDescription;
        }

        // Index Details
        function toggleIndexDetails() {
            vm.displayIndexDetails = !vm.displayIndexDetails;
            loadChartData();
        }

        function currentUserChanged(event: any, newUser: any) {
            initialize(newUser, vm.userName, vm.resourcePoolKey);
        }

        /* Chart objects */

        // TODO Store these in a better place?
        // TODO Also test these better, by comparing it with resourcePool.selectedElement() property!
        function ColumnChartItem(elementItem: any): void {
            var self = this;

            Object.defineProperty(self,
                "name",
                {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return elementItem.Name;
                    }
                });

            Object.defineProperty(self,
                "data",
                {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return [elementItem.totalIncome()];
                    }
                });
        }

        function ElementFieldIndexChartItem(elementFieldIndex: any): void {
            var self = this;

            Object.defineProperty(self,
                "name",
                {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return elementFieldIndex.Name;
                    }
                });

            Object.defineProperty(self,
                "y",
                {
                    enumerable: true,
                    configurable: true,
                    get() {
                        var indexRating = elementFieldIndex.indexRating();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(indexRating.toFixed(2));
                    }
                });
        }

        function PieChartItem(elementCell: any): void {
            var self = this;

            Object.defineProperty(self,
                "name",
                {
                    enumerable: true,
                    configurable: true,
                    get() {
                        return elementCell.ElementItem.Name;
                    }
                });

            Object.defineProperty(self,
                "y",
                {
                    enumerable: true,
                    configurable: true,
                    get() {
                        var numericValue = elementCell.numericValue();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(numericValue.toFixed(2));
                    }
                });
        }
    }
}

export const resourcePoolEditor: angular.IComponentOptions = {
    bindings: {
        config: "<"
    },
    controller: ResourcePoolEditorController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/resourcePoolEditor/resourcePoolEditor.html?v=0.65.0"
};
