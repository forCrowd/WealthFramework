(function () {
    'use strict';

    var directiveId = 'resourcePoolEditor';
    angular.module('main')
        .directive(directiveId, ['resourcePoolService',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService, logger) {
        logger = logger.forSource(directiveId);

        function link(scope, element, attrs) {

            scope.decreaseMultiplier = decreaseMultiplier;
            scope.increaseMultiplier = increaseMultiplier;
            scope.resetMultiplier = resetMultiplier;
            scope.decreaseResourcePoolRate = decreaseResourcePoolRate;
            scope.increaseResourcePoolRate = increaseResourcePoolRate;
            scope.resetResourcePoolRate = resetResourcePoolRate;

            initialize();

            function initialize() {
                getResourcePool();
            };

            function getResourcePool() {
                resourcePoolService.getResourcePool(scope.resourcePoolId)
                    .success(function (resourcePool) {
                        scope.resourcePool = resourcePool;
                    });
            }

            function decreaseMultiplier() {
                resourcePoolService.decreaseMultiplier(scope.resourcePoolId)
                    .success(function () {
                        getResourcePool();
                    });
            }

            function increaseMultiplier() {
                resourcePoolService.increaseMultiplier(scope.resourcePoolId)
                    .success(function () {
                        getResourcePool();
                    });
            }

            function resetMultiplier() {
                resourcePoolService.resetMultiplier(scope.resourcePoolId)
                    .success(function () {
                        getResourcePool();
                    });
            }

            function decreaseResourcePoolRate() {
                resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, scope.resourcePool.ResourcePoolRate - 5)
                    .success(function () {
                        getResourcePool();
                    });
            }

            function increaseResourcePoolRate() {
                resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, scope.resourcePool.ResourcePoolRate + 5)
                    .success(function () {
                        getResourcePool();
                    });
            }

            function resetResourcePoolRate() {
                resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, 0)
                    .success(function () {
                        getResourcePool();
                    });
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/App/views/directives/resourcePoolEditor.html',
            scope: {
                resourcePoolId: '='
            },
            link: link
        };
    };

})();
