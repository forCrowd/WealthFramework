(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomListController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            'logger',
			resourcePoolCustomListController]);

    function resourcePoolCustomListController(resourcePoolFactory,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolSet = [];

        initialize();

        function initialize() {
            getResourcePoolSet();
        };

        function getResourcePoolSet() {
            resourcePoolFactory.getResourcePoolSet(false)
			    .then(function (data) {
                    vm.resourcePoolSet = data;
                });
        }
    };
})();
