(function () {
    'use strict';

    var controllerId = 'IntroductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', '$timeout', 'logger', IntroductionController]);

    function IntroductionController(resourcePoolFactory, userFactory, $scope, $timeout, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // Timer
        var increaseMultiplierTimeout = $timeout(increaseMultiplier, 5000);

        var vm = this;
        vm.upoConfig = { resourcePoolId: 1 };

        function increaseMultiplier() {

            // Call the service to increase the multiplier
            resourcePoolFactory.getResourcePoolExpanded(vm.upoConfig.resourcePoolId)
                .then(function (resourcePool) {

                    if (resourcePool === null) {
                        return;
                    }

                    resourcePool.ElementSet.forEach(function (element) {
                        userFactory.updateElementMultiplier(element, 'increase');
                    });
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
    }
})();
