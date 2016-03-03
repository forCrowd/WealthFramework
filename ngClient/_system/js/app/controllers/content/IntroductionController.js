(function () {
    'use strict';

    var controllerId = 'IntroductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', '$timeout', 'logger', IntroductionController]);

    function IntroductionController(resourcePoolFactory, userFactory, $scope, $timeout, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.upoConfig = {};

        _init();

        /*** Implementations ***/

        function _init() {

            var upoId = -101;

            resourcePoolFactory.getResourcePoolExpanded(upoId)
                .then(function (resourcePool) {
                    if (resourcePool === null) {

                        resourcePoolFactory.createResourcePoolDirectIncomeAndMultiplier()
                            .then(function (resourcePool) {
                                resourcePool.Id = upoId;
                                resourcePool.Name = 'Unidentified Profiting Object (UPO)';
                                resourcePool.InitialValue = 0;
                                resourcePool.isTemp = true;
                                resourcePool.displayMultiplierFunctions = false;
                                resourcePool.UserResourcePoolSet[0].entityAspect.setDeleted(); // Remove resource pool rate

                                var mainElement = resourcePool.mainElement();
                                mainElement.Name = 'Organization';

                                mainElement.ElementItemSet[0].Name = 'UPO';
                                resourcePoolFactory.removeElementItem(mainElement.ElementItemSet[1]);

                                resourcePool._init(true);

                                initResourcePool(resourcePool);
                            });
                    } else {
                        initResourcePool(resourcePool);
                    }

                    function initResourcePool(resourcePool) {
                        vm.upoConfig.resourcePoolId = resourcePool.Id;

                        var increaseMultiplierTimeout = $timeout(increaseMultiplier, 5000);

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
                });
        }

    }
})();
