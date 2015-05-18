(function () {
    'use strict';

    var controllerId = 'sectorIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', sectorIndexSampleController]);

    function sectorIndexSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isAuthenticated = false;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                if (userInfo === null) {
                    return;
                }

                vm.isAuthenticated = true;
            })
            .catch(function (error) {

            })
            .finally(function () {
                vm.sectorIndex_SampleResourcePoolId = 4;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });
    };
})();
