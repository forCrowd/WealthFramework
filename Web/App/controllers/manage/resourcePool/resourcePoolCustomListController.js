(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomListController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            'logger',
			resourcePoolCustomListController]);

    function resourcePoolCustomListController(resourcePoolService,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolSet = [];

        initialize();

        function initialize() {
            getResourcePoolSet();
        };

        function getResourcePoolSet() {
            resourcePoolService.getResourcePoolSet(false)
			    .then(function (data) {
                    vm.resourcePoolSet = data;
                });
        }
    };
})();
