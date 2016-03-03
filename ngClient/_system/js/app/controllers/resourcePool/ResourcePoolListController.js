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

        _init();

        function _init() {
            resourcePoolFactory.getResourcePoolSet(false)
			    .then(function (data) {
			        vm.resourcePoolSet = data;
			    });
        }
    }
})();
