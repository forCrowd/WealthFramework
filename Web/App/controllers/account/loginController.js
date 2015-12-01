(function () {
    'use strict';

    var controllerId = 'loginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', '$rootScope', 'logger', loginController]);

    function loginController(userFactory, $location, $rootScope, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.getAccessToken = getAccessToken;

        function getAccessToken() {
            userFactory.getAccessToken(vm.email, vm.password)
                .success(function () {

                    userFactory.getCurrentUser()
                        .then(function (currentUser) {

                            // Move anonymously created entities to this logged in user
                            userFactory.updateAnonymousChanges(currentUser);

                            // Save changes
                            userFactory.saveChanges()
                                .then(function () {

                                    // Redirect the user to the previous page, except if it's login
                                    $location.path($rootScope.locationHistory[$rootScope.locationHistory.length - 2].path());
                                });
                        });
                })
                .error(function (response) {
                    if (typeof response.error_description !== 'undefined') {
                        logger.logError(response.error_description, null, true);
                    } else {
                        logger.logError(response, null, true);
                    }
                });
        }
    };
})();
