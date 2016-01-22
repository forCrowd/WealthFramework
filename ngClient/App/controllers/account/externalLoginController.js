(function () {
    'use strict';

    var controllerId = 'ExternalLoginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', '$scope', 'logger', ExternalLoginController]);

    function ExternalLoginController(userFactory, $location, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.error = '';
        vm.currentUser = null;

        // User logged in & out
        $scope.$on('userLoggedIn', function (event, currentUser) {
            vm.currentUser = currentUser;
        });

        _init();

        function _init() {

            userFactory.getCurrentUser()
                .then(function (currentUser) {

                    vm.currentUser = currentUser;

                    // No need to continue
                    if (vm.currentUser.isAuthenticated()) {
                        return;
                    }
                    
                    // Validate
                    var tempToken = $location.search().tempToken;
                    if (typeof tempToken === 'undefined') {
                        vm.error = 'Invalid token';
                        return;
                    }

                    // Authenticate
                    userFactory.getAccessToken('', '', tempToken)
                        .error(function (data) {
                            vm.error = 'Invalid token';
                        });
                });
        }
    }
})();
