(function () {
    'use strict';

    var controllerId = 'IntroductionController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', 'resourcePoolFactory', '$scope', '$timeout', IntroductionController]);

    function IntroductionController(dataContext, logger, resourcePoolFactory, $scope, $timeout) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.upoConfig = { userName: 'sample', resourcePoolKey: 'Unidentified-Profiting-Object' };

        // TODO Disabled for the moment, since it automatically triggers 'anonymous user interacted' / SH - 07 Jun. '16
        //_init();

        /*** Implementations ***/

        function _init() {

            resourcePoolFactory.getResourcePoolExpanded(vm.upoConfig)
                .then(function (resourcePool) {

                    var increaseMultiplierTimeout = $timeout(increaseMultiplier, 500);

                    function increaseMultiplier() {

                        // Increase the multiplier
                        resourcePool.ElementSet.forEach(function (element) {
                            dataContext.updateElementMultiplier(element, 'increase');
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
                });
        }
    }
})();
