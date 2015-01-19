(function () {
    'use strict';

    var controllerId = 'chapter0Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', '$scope', '$timeout', '$rootScope', 'logger', chapter0Controller]);

    function chapter0Controller(resourcePoolService, $scope, $timeout, $rootScope, logger) {

        var vm = this;
        vm.basicsExistingModelResourcePoolId = 2; // Static
        vm.basicsNewModelResourcePoolId = 3; // Static
        logger = logger.forSource(controllerId);

        initialize();

        /* Implementations */

        function initialize() {

            initializeUPOSample();
            initializeBasicSample();

            function initializeUPOSample() {
                // Initial start
                var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 5000);
                var increaseMultiplierTimeoutRecursive = null;

                function increaseMultiplier() {

                    // Call the service to increase the multiplier
                    resourcePoolService.increaseMultiplier(1);

                    // Then increase recursively
                    // TODO Decrease this timeout interval
                    var increaseMultiplierTimeoutRecursive = $timeout(increaseMultiplier, 10000);
                }

                // When the DOM element is removed from the page,
                // AngularJS will trigger the $destroy event on
                // the scope. This gives us a chance to cancel any
                // pending timer that we may have.
                $scope.$on("$destroy", function (event) {
                    $timeout.cancel(increaseMultiplierTimeoutInitial);
                    $timeout.cancel(increaseMultiplierTimeoutRecursive);
                });
            }

            function initializeBasicSample() {

                // Listen resource pool updated event
                $rootScope.$on('resourcePool_MultiplierIncreased', updateOppositeResourcePool);
                $rootScope.$on('resourcePool_MultiplierDecreased', updateOppositeResourcePool);
                $rootScope.$on('resourcePool_MultiplierReset', updateOppositeResourcePool);

                function updateOppositeResourcePool(event, resourcePoolId, eventSource) {
                    
                    if ((resourcePoolId === vm.basicsExistingModelResourcePoolId
                        || resourcePoolId === vm.basicsNewModelResourcePoolId)
                        && eventSource !== 'chapter0Controller') {

                        var oppositeResourcePoolId = resourcePoolId === vm.basicsExistingModelResourcePoolId
                            ? vm.basicsNewModelResourcePoolId
                            : vm.basicsExistingModelResourcePoolId;

                        switch (event.name) {
                            case 'resourcePool_MultiplierIncreased': { resourcePoolService.increaseMultiplier(oppositeResourcePoolId, 'chapter0Controller'); break; }
                            case 'resourcePool_MultiplierDecreased': { resourcePoolService.decreaseMultiplier(oppositeResourcePoolId, 'chapter0Controller'); break; }
                            case 'resourcePool_MultiplierReset': { resourcePoolService.resetMultiplier(oppositeResourcePoolId, 'chapter0Controller'); break; }
                        }
                    }
                }

            }
        }
    };
})();
