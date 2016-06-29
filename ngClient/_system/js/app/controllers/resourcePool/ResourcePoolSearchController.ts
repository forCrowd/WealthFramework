module Main.Controller {
    'use strict';

    var controllerId = 'ResourcePoolSearchController';

    export class ResourcePoolSearchController {

        static $inject = ['dataContext', 'logger', 'resourcePoolFactory', '$location', '$rootScope', '$scope'];

        constructor(dataContext: any,
            logger: any,
            resourcePoolFactory: any,
            $location: any,
            $rootScope: any,
            $scope: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.resourcePoolSet = [];
            vm.searchKey = '';
            vm.searchKeyChanged = searchKeyChanged;
            vm.showResults = false;

            _init();

            function _init() {
            }

            function searchKeyChanged() {

                if (vm.searchKey.length <= 2) {
                    vm.showResults = false;
                    return;
                }

                resourcePoolFactory.getResourcePoolSet(vm.searchKey)
                    .then(data => {
                        vm.resourcePoolSet = data;
                        vm.showResults = true;
                    });
            }
        }
    }

    angular.module('main').controller(controllerId, ResourcePoolSearchController);
}