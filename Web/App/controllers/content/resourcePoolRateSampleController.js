(function () {
    'use strict';

    var controllerId = 'resourcePoolRateSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', resourcePoolRateSampleController]);

    function resourcePoolRateSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isAuthenticated = false;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.isAuthenticated = userInfo.Id > 0;
            })
            .catch(function (error) {

            })
            .finally(function () {
                vm.resourcePoolRate_SampleResourcePoolId = 12;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });
    };
})();
