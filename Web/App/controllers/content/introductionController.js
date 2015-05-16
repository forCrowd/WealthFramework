(function () {
    'use strict';

    var controllerId = 'introductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userService', '$scope', '$timeout', '$rootScope', 'logger', introductionController]);

    function introductionController(resourcePoolService, userService, $scope, $timeout, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isAuthenticated = false;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.isAuthenticated = true;
            })
            .catch(function (error) {

            })
            .finally(function () {
                vm.introduction_UPOResourcePoolId = 1;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });

        // Timers
        var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 5000);
        var increaseMultiplierTimeoutRecursive = null;

        function increaseMultiplier() {

            if (!vm.isAuthenticated)
                return;

            // Call the service to increase the multiplier
            resourcePoolService.getResourcePoolExpandedWithUser(vm.introduction_UPOResourcePoolId)
                .then(function (resourcePoolSet) {
                    var resourcePool = resourcePoolSet[0];
                    for (var i = 0; i < resourcePool.ElementSet.length; i++) {
                        var element = resourcePool.ElementSet[i];
                        var updated = resourcePoolService.updateElementMultiplier(element, 'increase');

                        if (updated) {

                            // Don't save these changes, not that important, if there will be another save operation, they can go together?
                            // resourcePoolService.saveChanges(1000);

                        }
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
