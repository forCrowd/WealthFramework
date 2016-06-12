(function () {
    'use strict';

    var controllerId = 'ResourcePoolSearchController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', 'resourcePoolFactory', '$location', '$rootScope', '$scope', ResourcePoolSearchController]);

    function ResourcePoolSearchController(dataContext, logger, resourcePoolFactory, $location, $rootScope, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
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
                .then(function (data) {
                    vm.resourcePoolSet = data;
                    vm.showResults = true;
                });
        }
    }
})();
