(function () {
    'use strict';

    var controllerId = 'userResourcePoolCustomListController';
    angular.module('main')
        .controller(controllerId, ['userResourcePoolService',
            'logger',
			userResourcePoolCustomListController]);

    function userResourcePoolCustomListController(userResourcePoolService,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.userResourcePoolSet = [];

        initialize();

        function initialize() {
            getUserResourcePoolSet();
        };

        function getUserResourcePoolSet() {
            userResourcePoolService.getUserResourcePoolSet(false)
			    .then(function (data) {
                    vm.userResourcePoolSet = data;
                });
        }
    };
})();
