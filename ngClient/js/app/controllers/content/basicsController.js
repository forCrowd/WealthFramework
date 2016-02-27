(function () {
    'use strict';

    var controllerId = 'BasicsController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', 'dataContext', '$scope', 'logger', BasicsController]);

    function BasicsController(resourcePoolFactory, userFactory, dataContext, $scope, logger) {

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

            var existingModelSampleId = -102;
            var newModelSampleId = -103;

            resourcePoolFactory.getResourcePoolExpanded(existingModelSampleId)
                .then(function (resourcePool) {
                    if (resourcePool === null) {
                        getBasicsSample()
                            .then(function (resourcePool) {
                                resourcePool.Id = existingModelSampleId;
                                resourcePool.Name = 'Basics - Existing Model';
                                resourcePool.UserResourcePoolSet[0].entityAspect.setDeleted(); // Remove resource pool rate
                                resourcePool._init(true);

                                vm.existingModelConfig.resourcePoolId = resourcePool.Id;
                            });
                    } else {
                        vm.existingModelConfig.resourcePoolId = resourcePool.Id;
                    }
                });

            resourcePoolFactory.getResourcePoolExpanded(newModelSampleId)
                .then(function (resourcePool) {
                    if (resourcePool === null) {
                        getBasicsSample()
                            .then(function (resourcePool) {
                                resourcePool.Id = newModelSampleId;
                                resourcePool.Name = 'Basics - New Model';

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

                                // A fake user & ratings
                                // TODO Use factories instead of dataContext?
                                var fakeUser = dataContext.createEntity('User', {});

                                employeeSatisfactionField.ElementCellSet.forEach(function (elementCell) {
                                    var userElementCell = {
                                        User: fakeUser,
                                        ElementCell: elementCell,
                                        DecimalValue: Math.floor((Math.random() * 100) + 1)
                                    };

                                    dataContext.createEntity('UserElementCell', userElementCell);
                                });

                                resourcePool._init(true);

                                vm.newModelConfig.resourcePoolId = resourcePool.Id;
                            });
                    } else {
                        vm.newModelConfig.resourcePoolId = resourcePool.Id;
                    }
                });
        }

        function getBasicsSample() {
            return resourcePoolFactory.createResourcePoolDirectIncomeAndMultiplier()
                .then(function (resourcePool) {
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

                    return resourcePool;
                });
        }

        function updateOppositeResourcePool(event, element) {

            var oppositeResourcePoolId = 0;

            if (element.ResourcePool.Id === vm.existingModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.newModelConfig.resourcePoolId;
            } else if (element.ResourcePool.Id === vm.newModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.existingModelConfig.resourcePoolId;
            }

            // Call the service to increase the multiplier
            if (oppositeResourcePoolId !== 0) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeResourcePoolId)
                    .then(function (resourcePool) {
                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'increase');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierDecreased': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'decrease');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierReset': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'reset');
                                break;
                            }
                        }
                    });
            }
        }
    }
})();
