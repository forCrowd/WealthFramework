(function () {
    'use strict';

    var controllerId = 'ResourcePoolViewController';
    angular.module('main')
        .controller(controllerId, ['logger', 'resourcePoolFactory', '$location', '$rootScope', '$routeParams', ResourcePoolViewController]);

    function ResourcePoolViewController(logger, resourcePoolFactory, $location, $rootScope, $routeParams) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.editorConfig = {
            resourcePoolKey: $routeParams.resourcePoolKey,
            userName: $routeParams.userName
        };

        _init();

        function _init() {

            // Title
            resourcePoolFactory.getResourcePoolExpanded(vm.editorConfig)
                .then(function (resourcePool) {

                    // Not found, navigate to 404
                    if (resourcePool === null) {
                        var invalidUrl = '/' + vm.editorConfig.userName + '/' + vm.editorConfig.resourcePoolKey;
                        $location.url('/_system/content/notFound?url=' + invalidUrl);
                        return;
                    }

                    // TODO viewTitle was also set in route.js?
                    $rootScope.viewTitle = resourcePool.name();
                });
        }
    }
})();
