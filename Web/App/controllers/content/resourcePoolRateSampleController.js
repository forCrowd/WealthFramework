(function () {
    'use strict';

    var controllerId = 'resourcePoolRateSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', resourcePoolRateSampleController]);

    function resourcePoolRateSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.authorized = false;
        vm.resourcePoolRate_SampleResourcePoolId = 12;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.authorized = true;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.authorized = false;
        });
    };
})();
