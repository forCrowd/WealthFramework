(function () {
    'use strict';

    var controllerId = 'ResourcePoolListController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            'logger',
			ResourcePoolListController]);

    function ResourcePoolListController(resourcePoolFactory,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolSet = [];

        initialize();

        function initialize() {
            resourcePoolFactory.getResourcePoolSet(false)
			    .then(function (data) {
			        vm.resourcePoolSet = data;
			    });
        }
    }
})();
