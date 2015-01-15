(function () {
    'use strict';

    var controllerId = 'chapter0Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', '$scope', '$timeout', 'logger', chapter0Controller]);

    function chapter0Controller(resourcePoolService, $scope, $timeout, logger) {

        var vm = this;
        logger = logger.forSource(controllerId);

        initialize();

        /* Implementations */

        function initialize() {

            // Initial start
            var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 5000);
            var increaseMultiplierTimeoutRecursive = null;

            function increaseMultiplier() {

                // Call the service to increase the multiplier
                resourcePoolService.increaseMultiplier(1);

                // Then increase recursively
                var increaseMultiplierTimeoutRecursive = $timeout(increaseMultiplier, 2000);
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
    };
})();
