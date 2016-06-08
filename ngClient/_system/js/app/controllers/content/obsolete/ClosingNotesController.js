(function () {
    'use strict';

    var controllerId = 'ClosingNotesController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', '$rootScope', '$scope', ClosingNotesController]);

    function ClosingNotesController(dataContext, logger, $location, $rootScope, $scope) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.currentUser = { isAuthenticated: function () { return false; } };

        $scope.$on('dataContext_currentUserChanged', currentUserChanged);

        _init();

        /*** Implementations ***/

        function _init() {
            getApplicationInfo();

            dataContext.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                });
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }
    }
})();
