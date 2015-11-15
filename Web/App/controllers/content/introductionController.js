(function () {
    'use strict';

    var controllerId = 'introductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userService', '$scope', '$timeout', 'logger', introductionController]);

    function introductionController(resourcePoolService, userService, $scope, $timeout, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // Timer
        var increaseMultiplierTimeout = $timeout(increaseMultiplier, 5000);

        var vm = this;
        vm.introduction_UPOResourcePoolId = 1;
        vm.isAuthenticated = false;

        userService.isAuthenticated()
            .then(function (isAuthenticated) {
                vm.isAuthenticated = isAuthenticated;
            });

        // User logged in & out
        $scope.$on('userLoggedIn', function () {
            vm.isAuthenticated = true;
        });

        $scope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });

        function increaseMultiplier() {

            // Call the service to increase the multiplier
            resourcePoolService.getResourcePoolExpanded(vm.introduction_UPOResourcePoolId)
                .then(function (resourcePool) {

                    if (resourcePool === null) {
                        return;
                    }

                    var resourcePool = resourcePoolSet[0];
                    for (var i = 0; i < resourcePool.ElementSet.length; i++) {

                        var element = resourcePool.ElementSet[i];
                        userService.updateElementMultiplier(element, 'increase');
                    }
                });

            // Then increase recursively
            increaseMultiplierTimeout = $timeout(increaseMultiplier, 2500);
        }

        // When the DOM element is removed from the page,
        // AngularJS will trigger the $destroy event on
        // the scope. This gives us a chance to cancel any
        // pending timer that we may have.
        $scope.$on("$destroy", function (event) {
            $timeout.cancel(increaseMultiplierTimeout);
        });
    };
})();
