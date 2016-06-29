module Main.Controller {
    'use strict';

    var controllerId = 'ResourcePoolViewController';

    export class ResourcePoolViewController {

        static $inject = ['logger', 'resourcePoolFactory', '$location', '$rootScope', '$routeParams'];

        constructor(logger: any,
            resourcePoolFactory: any,
            $location: any,
            $rootScope: any,
            $routeParams: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.editorConfig = {
                resourcePoolKey: $routeParams.resourcePoolKey,
                userName: $routeParams.userName
            };

            _init();

            function _init() {

                // Title
                resourcePoolFactory.getResourcePoolExpanded(vm.editorConfig)
                    .then(resourcePool => {

                        // Not found, navigate to 404
                        if (resourcePool === null) {
                            $location.url('/_system/content/notFound?url=' + $location.url());
                            return;
                        }

                        // TODO viewTitle was also set in route.js?
                        $rootScope.viewTitle = resourcePool.Name;
                    });
            }
        }
    }

    angular.module('main').controller(controllerId, ResourcePoolViewController);
}