(function () {
    'use strict';

    var controllerId = 'fairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', fairShareIndexSampleController]);

    function fairShareIndexSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.authorized = false;
        vm.fairShareIndex_SampleResourcePoolId = 10;

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
