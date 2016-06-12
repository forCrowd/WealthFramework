(function () {
    'use strict';

    var controllerId = 'AccountController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$routeParams', '$scope', AccountController]);

    function AccountController(dataContext, logger, $routeParams, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentUser = dataContext.getCurrentUser();

        // Events
        $scope.$on('dataContext_currentUserChanged', currentUserChanged);

        _init();

        function _init() {
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }
    }
})();
