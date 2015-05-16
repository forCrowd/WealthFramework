(function () {
    'use strict';

    var controllerId = 'fairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', fairShareIndexSampleController]);

    function fairShareIndexSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isAuthenticated = false;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.isAuthenticated = true;
            })
            .catch(function (error) {

            })
            .finally(function () {
                vm.fairShareIndex_SampleResourcePoolId = 10;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });
    };
})();
