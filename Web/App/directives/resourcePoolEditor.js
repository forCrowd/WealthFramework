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
            scope.updateResourcePoolRate = updateResourcePoolRate;

            scope.$watch('resourcePoolId', function () {
                getResourcePool();
            }, true);

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

            function updateResourcePoolRate(rate) {
                resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, rate)
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
