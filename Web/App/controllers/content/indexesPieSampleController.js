(function () {
    'use strict';

    var controllerId = 'indexesPieSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', indexesPieSampleController]);

    function indexesPieSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isAuthenticated = false;

        // Logged in?
        userService.getCurrentUser()
            .then(function (currentUser) {
                vm.isAuthenticated = currentUser.Id > 0;
            })
            .catch(function (error) {

            })
            .finally(function () {
                vm.indexesPie_SampleResourcePoolId = 11;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });
    };
})();
