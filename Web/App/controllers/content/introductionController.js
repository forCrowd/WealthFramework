(function () {
    'use strict';

    var controllerId = 'introductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userService', '$scope', '$timeout', '$rootScope', 'logger', introductionController]);

    function introductionController(resourcePoolService, userService, $scope, $timeout, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.authorized = false;
        vm.introduction_UPOResourcePoolId = 1;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.authorized = true;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.authorized = false;
        });

        // Timers
        var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 1500);
        var increaseMultiplierTimeoutRecursive = null;

        function increaseMultiplier() {

            if (!vm.authorized)
                return;

            // Call the service to increase the multiplier
            resourcePoolService.getResourcePoolExpanded(vm.introduction_UPOResourcePoolId)
                .then(function (resourcePoolSet) {
                    var resourcePool = resourcePoolSet[0];
                    for (var i = 0; i < resourcePool.ElementSet.length; i++) {
                        var element = resourcePool.ElementSet[i];
                        resourcePoolService.updateElementMultiplier(element, 'increase');
                    }
                });

            // Then increase recursively
            // TODO Decrease this timeout interval
            var increaseMultiplierTimeoutRecursive = $timeout(increaseMultiplier, 300000); // Update this before release - 3000!
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
