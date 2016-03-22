(function () {
    'use strict';

    var controllerId = 'BasicsController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'dataContext', '$scope', 'logger', BasicsController]);

    function BasicsController(resourcePoolFactory, dataContext, $scope, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.existingModelConfig = {};
        vm.newModelConfig = {};

        // Listen resource pool updated event
        $scope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        _init();

        /*** Implementations ***/

        function _init() {

            dataContext.getCurrentUser()
                .then(function (currentUser) {
                    vm.existingModelConfig = { userName: currentUser.UserName, resourcePoolKey: 'Basics-Existing-Model' };
                    vm.newModelConfig = { userName: currentUser.UserName, resourcePoolKey: 'Basics-New-Model' };

                    resourcePoolFactory.getResourcePoolExpanded(vm.existingModelConfig)
                        .then(function (resourcePool) {
                            if (resourcePool === null) {
                                getBasicsSample()
                                    .then(function (resourcePool) {
                                        dataContext.createEntitySuppressAuthValidation(true);

                                        resourcePool.Name = 'Basics - Existing Model';
                                        resourcePool.Key = vm.existingModelConfig.resourcePoolKey;
                                        resourcePool.UserResourcePoolSet[0].entityAspect.setDeleted(); // Remove resource pool rate
                                        resourcePool._init(true);

                                        dataContext.createEntitySuppressAuthValidation(false);
                                    });
                            }
                        });

                    resourcePoolFactory.getResourcePoolExpanded(vm.newModelConfig)
                        .then(function (resourcePool) {
                            if (resourcePool === null) {
                                getBasicsSample()
                                    .then(function (resourcePool) {
                                        dataContext.createEntitySuppressAuthValidation(true);

                                        resourcePool.Name = 'Basics - New Model';
                                        resourcePool.Key = vm.newModelConfig.resourcePoolKey;

                                        // Employee Satisfaction field (index)
                                        var employeeSatisfactionField = resourcePoolFactory.createElementField({
                                            Element: resourcePool.mainElement(),
                                            Name: 'Employee Satisfaction',
                                            DataType: 4,
                                            UseFixedValue: false,
                                            IndexEnabled: true,
                                            IndexCalculationType: 1,
                                            IndexSortType: 1,
                                            SortOrder: 2
                                        });

                                        employeeSatisfactionField.ElementCellSet.forEach(function (elementCell) {
                                            var userElementCell = {
                                                ElementCell: elementCell,
                                                DecimalValue: Math.floor((Math.random() * 100) + 1)
                                            };

                                            dataContext.createEntity('UserElementCell', userElementCell);
                                        });

                                        resourcePool._init(true);

                                        dataContext.createEntitySuppressAuthValidation(false);
                                    });
                            }
                        });
                });
        }

        function getBasicsSample() {

            dataContext.createEntitySuppressAuthValidation(true);

            return resourcePoolFactory.createResourcePoolDirectIncomeAndMultiplier()
                .then(function (resourcePool) {
                    dataContext.createEntitySuppressAuthValidation(true);

                    resourcePool.InitialValue = 0;
                    resourcePool.isTemp = true;

                    var mainElement = resourcePool.mainElement();
                    mainElement.Name = 'Organization';

                    mainElement.ElementItemSet[0].Name = 'Alpha';
                    mainElement.ElementItemSet[1].Name = 'Beta';
                    resourcePoolFactory.createElementItem({
                        Element: mainElement,
                        Name: 'Charlie'
                    });
                    resourcePoolFactory.createElementItem({
                        Element: mainElement,
                        Name: 'Delta'
                    });

                    dataContext.createEntitySuppressAuthValidation(false);

                    return resourcePool;
                })
                .finally(function () {
                    dataContext.createEntitySuppressAuthValidation(false);
                });
        }

        function updateOppositeResourcePool(event, element) {

            var oppositeKey = null;

            if (element.ResourcePool.User.UserName === vm.existingModelConfig.userName && element.ResourcePool.Key === vm.existingModelConfig.resourcePoolKey) {
                oppositeKey = vm.newModelConfig;
            } else if (element.ResourcePool.User.UserName === vm.newModelConfig.userName && element.ResourcePool.Key === vm.newModelConfig.resourcePoolKey) {
                oppositeKey = vm.existingModelConfig;
            }

            // Call the service to increase the multiplier
            if (oppositeKey !== null) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeKey)
                .then(function (resourcePool) {
                    switch (event.name) {
                        case 'resourcePoolEditor_elementMultiplierIncreased': {
                            dataContext.updateElementMultiplier(resourcePool.mainElement(), 'increase');
                            break;
                        }
                        case 'resourcePoolEditor_elementMultiplierDecreased': {
                            dataContext.updateElementMultiplier(resourcePool.mainElement(), 'decrease');
                            break;
                        }
                        case 'resourcePoolEditor_elementMultiplierReset': {
                            dataContext.updateElementMultiplier(resourcePool.mainElement(), 'reset');
                            break;
                        }
                    }
                });
            }
        }
    }
})();
