(function () {
    'use strict';

    var controllerId = 'PriorityIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'dataContext', '$scope', 'logger', PriorityIndexController]);

    function PriorityIndexController(resourcePoolFactory, dataContext, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.priorityIndexConfig = { userName: 'sample', resourcePoolKey: 'Priority-Index-Sample' };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', updateAllInOne);

        // Sync this example's values with 'All in One'
        function updateAllInOne(event, cell) {

            if (cell.ElementField.Element.ResourcePool.User.UserName !== vm.priorityIndexConfig.userName &&
                cell.ElementField.Element.ResourcePool.Key !== vm.priorityIndexConfig.resourcePoolKey) {
                return;
            }

            var allInOneUniqueKey = { userName: 'sample', resourcePoolKey: 'All-in-One' };
            resourcePoolFactory.getResourcePoolExpanded(allInOneUniqueKey)
                .then(function (resourcePool) {

                    // If the current user already interacted with 'All in One', stop copying ratings
                    if (typeof resourcePool.userInteracted !== 'undefined' && resourcePool.userInteracted) {
                        return;
                    }

                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        if (element.Name === cell.ElementField.Element.Name) {
                            // Element fields
                            for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                var elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === cell.ElementField.Name) {
                                    // Element cells
                                    for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        var elementCell = elementField.ElementCellSet[elementCellIndex];
                                        if (elementCell.ElementItem.Name === cell.ElementItem.Name) {
                                            switch (event.name) {
                                                case 'resourcePoolEditor_elementCellNumericValueIncreased': {
                                                    dataContext.updateElementCellNumericValue(elementCell, 'increase');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueDecreased': {
                                                    dataContext.updateElementCellNumericValue(elementCell, 'decrease');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueReset': {
                                                    dataContext.updateElementCellNumericValue(elementCell, 'reset');
                                                    break;
                                                }
                                            }

                                            // Save changes
                                            dataContext.saveChanges(1500);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
})();
