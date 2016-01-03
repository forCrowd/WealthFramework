(function () {
    'use strict';

    var controllerId = 'externalLoginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', externalLoginController]);

    function externalLoginController(userFactory, $location, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.error = '';
        vm.isAuthenticated = false;

        _init();

        function _init() {

            userFactory.isAuthenticated()
                .then(function (isAuthenticated) {

                    vm.isAuthenticated = isAuthenticated;

                    // No need to continue
                    if (isAuthenticated) {
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

                            // Actually this is not necessary, since search('tempToken', null) will redirect and 
                            vm.isAuthenticated = true;

                            // Clear search param
                            $location.search('tempToken', null);
                        })
                        .error(function (data) {
                            vm.error = 'Invalid token';
                        });
                });

        }
    };
})();
