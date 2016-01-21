(function () {
    'use strict';

    var controllerId = 'ExternalLoginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', ExternalLoginController]);

    function ExternalLoginController(userFactory, $location, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.error = '';
        vm.isAuthenticated = false;

        _init();

        function _init() {

            userFactory.getCurrentUser()
                .then(function (currentUser) {

                    vm.isAuthenticated = currentUser.isAuthenticated();

                    // No need to continue
                    if (vm.isAuthenticated) {
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
                        .success(function (tokenData) {

                            // Clear search param (& redirect to itself)
                            $location.search('tempToken', null);
                        })
                        .error(function (data) {
                            vm.error = 'Invalid token';
                        });
                });

        }
    }
})();
