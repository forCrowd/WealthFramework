(function () {
    'use strict';

    var controllerId = 'PriorityIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', 'logger', PriorityIndexController]);

    function PriorityIndexController(resourcePoolFactory, userFactory, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.priorityIndexConfig = { resourcePoolId: 2 };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', updateAllInOne);

        // Sync this example's values with 'All in One'
        function updateAllInOne(event, cell) {

            var allInOneId = 7;

            if (cell.ElementField.Element.ResourcePoolId !== vm.priorityIndexConfig.resourcePoolId) {
                return;
            }

            resourcePoolFactory.getResourcePoolExpanded(allInOneId)
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
                                                    userFactory.updateElementCellNumericValue(elementCell, 'increase');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueDecreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'decrease');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueReset': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'reset');
                                                    break;
                                                }
                                            }

                                            // Save changes
                                            resourcePoolFactory.saveChanges(1500);
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
