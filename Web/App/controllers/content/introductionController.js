(function () {
    'use strict';

    var controllerId = 'introductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userService', '$scope', '$timeout', 'logger', introductionController]);

    function introductionController(resourcePoolService, userService, $scope, $timeout, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // Timers
        var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 5000);
        var increaseMultiplierTimeoutRecursive = null;

        var vm = this;
        vm.isAuthenticated = function () {
            return userService.isAuthenticated();
        }
        vm.introduction_UPOResourcePoolId = 1;

        function increaseMultiplier() {

            // Call the service to increase the multiplier
            resourcePoolService.getResourcePoolExpanded(vm.introduction_UPOResourcePoolId)
                .then(function (resourcePoolSet) {

                    if (resourcePoolSet.length === 0) {
                        return;
                    }

                    var resourcePool = resourcePoolSet[0];
                    for (var i = 0; i < resourcePool.ElementSet.length; i++) {

                        var element = resourcePool.ElementSet[i];
                        userService.updateElementMultiplier(element, 'increase');
                    }
                });

            // Then increase recursively
            var increaseMultiplierTimeoutRecursive = $timeout(increaseMultiplier, 2500);
        }

        // When the DOM element is removed from the page,
        // AngularJS will trigger the $destroy event on
        // the scope. This gives us a chance to cancel any
        // pending timer that we may have.
        $scope.$on("$destroy", function (event) {
            $timeout.cancel(increaseMultiplierTimeoutInitial);
            $timeout.cancel(increaseMultiplierTimeoutRecursive);
        });
    };
})();
