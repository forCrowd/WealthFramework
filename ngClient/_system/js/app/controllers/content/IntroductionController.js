(function () {
    'use strict';

    var controllerId = 'IntroductionController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', 'resourcePoolFactory', '$scope', '$timeout', IntroductionController]);

    function IntroductionController(dataContext, logger, resourcePoolFactory, $scope, $timeout) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.upoConfig = {};

        _init();

        /*** Implementations ***/

        function _init() {

            dataContext.getCurrentUser()
                .then(function (currentUser) {

                    vm.upoConfig = { userName: currentUser.UserName, resourcePoolKey: 'Unidentified-Profiting-Object' };

                    resourcePoolFactory.getResourcePoolExpanded(vm.upoConfig)
                        .then(function (resourcePool) {
                            if (resourcePool === null) {

                                dataContext.createEntitySuppressAuthValidation(true);

                                resourcePoolFactory.createResourcePoolDirectIncomeAndMultiplier()
                                    .then(function (resourcePool) {
                                        dataContext.createEntitySuppressAuthValidation(true);

                                        resourcePool.Name = 'Unidentified Profiting Object (UPO)';
                                        resourcePool.Key = vm.upoConfig.resourcePoolKey;
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

                                        dataContext.createEntitySuppressAuthValidation(false);
                                    })
                                    .finally(function () {
                                        dataContext.createEntitySuppressAuthValidation(false);
                                    });
                            } else {
                                initResourcePool(resourcePool);
                            }

                            function initResourcePool(resourcePool) {

                                var increaseMultiplierTimeout = $timeout(increaseMultiplier, 5000);

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
                            }
                        });
                });
        }
    }
})();
