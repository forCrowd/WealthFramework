(function () {
    'use strict';

    var controllerId = 'ResourcePoolListController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', 'resourcePoolFactory', '$location', '$rootScope', '$scope', ResourcePoolListController]);

    function ResourcePoolListController(dataContext, logger, resourcePoolFactory, $location, $rootScope, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.createNew = createNew;
        vm.currentUser = { Id: 0 };
        vm.resourcePoolSet = [];

        // Events
        $scope.$on('dataContext_currentUserChanged', currentUserChanged);

        _init();

        function _init() {

            dataContext.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;

                    resourcePoolFactory.getResourcePoolSet()
                        .then(function (data) {
                            vm.resourcePoolSet = data;
                        });
                });
        }

        function createNew() {
            if (vm.currentUser.isAuthenticated()) {
                $location.url('/' + vm.currentUser.UserName + '/new');
            } else {
                $rootScope.$broadcast('unauthenticatedUserInteracted', true);
            }
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }
    }
})();
