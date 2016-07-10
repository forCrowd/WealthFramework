﻿module Main.Controller {
    'use strict';

    var controllerId = 'ResourcePoolManageController';

    export class ResourcePoolManageController {

        static $inject = ['dataContext', 'Enums', 'logger', 'resourcePoolFactory', '$location', '$rootScope', '$routeParams', '$uibModal'];

        constructor(dataContext: any,
            Enums: any,
            logger: any,
            resourcePoolFactory: any,
            $location: any,
            $rootScope: any,
            $routeParams: any,
            $uibModal: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.addElement = addElement;
            vm.addElementField = addElementField;
            vm.addElementItem = addElementItem;
            vm.cancelElement = cancelElement;
            vm.cancelElementCell = cancelElementCell;
            vm.cancelElementField = cancelElementField;
            vm.cancelElementItem = cancelElementItem;
            vm.cancelResourcePool = cancelResourcePool;
            vm.editElement = editElement;
            vm.editElementCell = editElementCell;
            vm.editElementField = editElementField;
            vm.editElementItem = editElementItem;
            vm.element = null;
            vm.elementMaster = null;
            vm.elementCell = null;
            vm.elementCellMaster = null;
            vm.elementCellSet = elementCellSet;
            vm.elementField = null;
            vm.elementFieldMaster = null;
            vm.elementFieldSet = elementFieldSet;
            vm.elementFieldDataTypeFiltered = elementFieldDataTypeFiltered;
            vm.elementItem = null;
            vm.elementItemMaster = null;
            vm.elementItemSet = elementItemSet;
            vm.isElementEdit = false;
            vm.isElementNew = true;
            vm.isElementFieldEdit = false;
            vm.isElementFieldNew = true;
            vm.isElementItemEdit = false;
            vm.isElementItemNew = true;
            vm.isNew = $location.path().substring($location.path().lastIndexOf('/') + 1) === 'new';
            vm.isSaveEnabled = isSaveEnabled;
            vm.isSaving = false;
            vm.openRemoveResourcePoolModal = openRemoveResourcePoolModal;
            vm.removeElement = removeElement;
            vm.removeElementField = removeElementField;
            vm.removeElementItem = removeElementItem;
            vm.removeResourcePool = removeResourcePool;
            vm.resourcePool = { ElementSet: [] };
            vm.resourcePoolKey = $routeParams.resourcePoolKey;
            vm.saveResourcePool = saveResourcePool;
            vm.saveElement = saveElement;
            vm.saveElementCell = saveElementCell;
            vm.saveElementField = saveElementField;
            vm.saveElementItem = saveElementItem;
            vm.userName = $routeParams.userName;

            // Enums
            vm.ElementFieldDataType = Enums.ElementFieldDataType;
            vm.ElementFieldIndexCalculationType = Enums.ElementFieldIndexCalculationType;
            vm.ElementFieldIndexSortType = Enums.ElementFieldIndexSortType;

            _init();

            /*** Implementations ***/

            function _init() {

                if (vm.isNew) {

                    var currentUser = dataContext.getCurrentUser();

                    // If userName equals to current user
                    if (vm.userName === currentUser.UserName) {
                        vm.user = currentUser;

                        vm.resourcePool = resourcePoolFactory.createResourcePoolBasic();

                        // Title
                        // TODO viewTitle was also set in route.js?
                        $rootScope.viewTitle = vm.resourcePool.Name;

                    } else {
                        $location.url('/_system/content/notFound?url=' + $location.url());
                        return;
                    }

                } else {

                    var resourcePoolUniqueKey = { userName: vm.userName, resourcePoolKey: vm.resourcePoolKey };

                    resourcePoolFactory.getResourcePoolExpanded(resourcePoolUniqueKey)
                        .then(resourcePool => {

                            // Not found, navigate to 404
                            if (resourcePool === null) {
                                $location.url('/_system/content/notFound?url=' + $location.url());
                                return;
                            }

                            vm.resourcePool = resourcePool;

                            // Title
                            // TODO viewTitle was also set in route.js?
                            $rootScope.viewTitle = vm.resourcePool.Name;
                        });
                }
            }

            function addElement() {
                vm.element = resourcePoolFactory.createElement({
                    ResourcePool: vm.resourcePool,
                    Name: 'New element',
                    IsMainElement: false
                });

                vm.isElementEdit = true;
                vm.isElementNew = true;
            }

            function addElementField() {

                var element = vm.resourcePool.ElementSet[0];

                // A temp fix for default value of 'SortOrder'
                // Later handle 'SortOrder' by UI, not by asking
                var sortOrder = element.ElementFieldSet.length + 1;

                vm.elementField = resourcePoolFactory.createElementField({
                    Element: element,
                    Name: 'New field',
                    DataType: 1,
                    SortOrder: sortOrder
                });

                vm.isElementFieldEdit = true;
                vm.isElementFieldNew = true;
            }

            function addElementItem() {
                vm.elementItem = resourcePoolFactory.createElementItem({
                    Element: vm.resourcePool.ElementSet[0],
                    Name: 'New item'
                });
                vm.isElementItemEdit = true;
                vm.isElementItemNew = true;
            }

            function cancelElement() {

                // TODO Find a better way?
                // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
                if (vm.isElementNew) {
                    resourcePoolFactory.removeElement(vm.element);
                } else {
                    vm.element.Name = vm.elementMaster.Name;
                }

                vm.isElementEdit = false;
                vm.element = null;
                vm.elementMaster = null;
            }

            function cancelElementCell() {

                // TODO Find a better way?
                // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
                vm.elementCell.SelectedElementItemId = vm.elementCellMaster.SelectedElementItemId;
                vm.elementCell.UserElementCellSet[0]
                    .StringValue = vm.elementCellMaster.UserElementCellSet[0].StringValue;
                vm.elementCell.UserElementCellSet[0]
                    .BooleanValue = vm.elementCellMaster.UserElementCellSet[0].BooleanValue;
                vm.elementCell.UserElementCellSet[0]
                    .IntegerValue = vm.elementCellMaster.UserElementCellSet[0].IntegerValue;
                vm.elementCell.UserElementCellSet[0]
                    .DecimalValue = vm.elementCellMaster.UserElementCellSet[0].DecimalValue;
                vm.elementCell.UserElementCellSet[0]
                    .DateTimeValue = vm.elementCellMaster.UserElementCellSet[0].DateTimeValue;

                vm.isElementCellEdit = false;
                vm.elementCell = null;
                vm.elementCellMaster = null;
            }

            function cancelElementField() {

                // TODO Find a better way?
                // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
                if (vm.isElementFieldNew) {
                    resourcePoolFactory.removeElementField(vm.elementField);
                } else {
                    vm.elementField.Name = vm.elementFieldMaster.Name;
                    vm.elementField.DataType = vm.elementFieldMaster.DataType;
                    vm.elementField.SelectedElementId = vm.elementFieldMaster.SelectedElementId;
                    vm.elementField.UseFixedValue = vm.elementFieldMaster.UseFixedValue;
                    vm.elementField.IndexEnabled = vm.elementFieldMaster.IndexEnabled;
                    vm.elementField.IndexCalculationType = vm.elementFieldMaster.IndexCalculationType;
                    vm.elementField.IndexSortType = vm.elementFieldMaster.IndexSortType;
                    vm.elementField.SortOrder = vm.elementFieldMaster.SortOrder;
                }

                vm.isElementFieldEdit = false;
                vm.elementField = null;
                vm.elementFieldMaster = null;
            }

            function cancelElementItem() {

                // TODO Find a better way?
                // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / coni2k - 23 Nov. '15
                if (!vm.isElementItemNew) {
                    vm.elementItem.Name = vm.elementItemMaster.Name;
                }

                vm.isElementItemEdit = false;
                vm.elementItem = null;
                vm.elementItemMaster = null;
            }

            function cancelResourcePool() {

                dataContext.rejectChanges();

                var locationPath = vm.isNew ? '/' + dataContext.getCurrentUser().UserName : vm.resourcePool.urlView();

                $location.url(locationPath);
            }

            function editElement(element: any);
            function editElement(element) {
                vm.elementMaster = angular.copy(element);
                vm.element = element;
                vm.isElementEdit = true;
                vm.isElementNew = false;
            }

            function editElementCell(elementCell: any);
            function editElementCell(elementCell) {
                vm.elementCellMaster = angular.copy(elementCell);
                vm.elementCell = elementCell;
                vm.isElementCellEdit = true;
            }

            function editElementField(elementField: any);
            function editElementField(elementField) {
                vm.elementFieldMaster = angular.copy(elementField);
                vm.elementField = elementField;
                vm.isElementFieldEdit = true;
                vm.isElementFieldNew = false;
            }

            function editElementItem(elementItem: any);
            function editElementItem(elementItem) {
                vm.elementItemMaster = angular.copy(elementItem);
                vm.elementItem = elementItem;
                vm.isElementItemEdit = true;
                vm.isElementItemNew = false;
            }

            function elementCellSet() {

                var elementItems = elementItemSet();

                var list = [];
                elementItems.forEach(elementItem => {
                    elementItem.ElementCellSet.forEach(elementCell => {
                        list.push(elementCell);
                    });
                });
                return list;
            }

            function elementFieldSet() {
                var list = [];
                vm.resourcePool.ElementSet.forEach(element => {
                    element.ElementFieldSet.forEach(elementField => {
                        list.push(elementField);
                    });
                });
                return list;
            }

            function elementFieldDataTypeFiltered() {

                var filtered = {};
                for (var key in vm.ElementFieldDataType) {

                    // These types can be added only once at the moment
                    if (key === 'DirectIncome' || key === 'Multiplier') {
                        var exists = vm.elementField.Element.ElementFieldSet.some(fieldExists);

                        if (!exists) {
                            filtered[key] = vm.ElementFieldDataType[key];
                        }
                    } else if (key === 'Element') {
// Element type can only be added if there are more than one element in the pool
                        if (vm.elementField.Element.ResourcePool.ElementSet.length > 1) {
                            filtered[key] = vm.ElementFieldDataType[key];
                        }
                    } else {
                        filtered[key] = vm.ElementFieldDataType[key];
                    }
                }

                function fieldExists(field: any);
                function fieldExists(field) {
                    return vm.ElementFieldDataType[key] === field.ElementFieldDataType;
                }

                return filtered;
            }

            function elementItemSet() {
                var list = [];
                vm.resourcePool.ElementSet.forEach(element => {
                    element.ElementItemSet.forEach(elementItem => {
                        list.push(elementItem);
                    });
                });
                return list;
            }

            function isSaveEnabled() {
                var value = !vm.isSaving &&
                    typeof vm.resourcePoolForm !== 'undefined' &&
                    vm.resourcePoolForm.$valid;

                return value;
            }

            function openRemoveResourcePoolModal() {
                var modalInstance = $uibModal.open({
                    controller: ResourcePoolRemoveController,
                    controllerAs: 'vm',
                    keyboard: false,
                    templateUrl: '/_system/views/resourcePool/resourcePoolRemove.html?v=0.53.0'
                });

                modalInstance.result.then(() => {
                    removeResourcePool();
                },
                () => {});
            }

            function removeElement(element: any);
            function removeElement(element) {
                resourcePoolFactory.removeElement(element);
            }

            function removeElementField(elementField: any);
            function removeElementField(elementField) {
                resourcePoolFactory.removeElementField(elementField);
            }

            function removeElementItem(elementItem: any);
            function removeElementItem(elementItem) {
                resourcePoolFactory.removeElementItem(elementItem);
            }

            function removeResourcePool() {

                vm.isSaving = true;

                resourcePoolFactory.removeResourcePool(vm.resourcePool);

                dataContext.saveChanges()
                    .then(() => {
                        $location.url('/' + dataContext.getCurrentUser().UserName);
                    })
                    .finally(() => {
                        vm.isSaving = false;
                    });
            }

            function saveElement() {
                vm.isElementEdit = false;
                vm.element = null;
                vm.elementMaster = null;
            }

            function saveElementCell() {
                vm.isElementCellEdit = false;
                vm.elementCell = null;
                vm.elementCellMaster = null;
            }

            function saveElementField() {

                // Fixes
                // a. UseFixedValue must be null for String & Element types
                if (vm.elementField.DataType === vm.ElementFieldDataType.String ||
                    vm.elementField.DataType === vm.ElementFieldDataType.Element) {
                    vm.elementField.UseFixedValue = null;
                }

                // b. UseFixedValue must be 'false' for Multiplier type
                if (vm.elementField.DataType === vm.ElementFieldDataType.Multiplier) {
                    vm.elementField.UseFixedValue = false;
                }

                // c. DirectIncome cannot be Use Fixed Value false at the moment
                if (vm.elementField.DataType === vm.ElementFieldDataType.DirectIncome) {
                    vm.elementField.UseFixedValue = true;
                }

                vm.isElementFieldEdit = false;
                vm.elementField = null;
                vm.elementFieldMaster = null;
            }

            function saveElementItem() {

                if (vm.isElementItemNew) {
                    vm.elementItem = resourcePoolFactory.createElementItem(vm.elementItem);
                }

                vm.isElementItemEdit = false;
                vm.elementItem = null;
                vm.elementItemMaster = null;
            }

            function saveResourcePool() {

                vm.isSaving = true;

                // TODO Try to move this to a better place?
                vm.resourcePool.updateCache();

                dataContext.saveChanges()
                    .then(() => {
                        $location.url(vm.resourcePool.urlView());
                    })
                    .finally(() => {
                        vm.isSaving = false;
                    });
            }
        }
    }

    class ResourcePoolRemoveController {

        static $inject = ['$scope', '$uibModalInstance'];

        constructor($scope: any, $uibModalInstance: any) {

            var vm: any = this;
            vm.cancel = cancel;
            vm.remove = remove;

            function cancel() {
                $uibModalInstance.dismiss('cancel');
            }

            function remove() {
                $uibModalInstance.close();
            }
        }        
    }

    angular.module('main').controller(controllerId, ResourcePoolManageController);
}