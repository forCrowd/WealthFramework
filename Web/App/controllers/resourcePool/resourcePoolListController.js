(function () {
    'use strict';

    var controllerId = 'resourcePoolListController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            'logger',
			resourcePoolListController]);

    function resourcePoolListController(resourcePoolFactory,
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
        };
    };
})();
