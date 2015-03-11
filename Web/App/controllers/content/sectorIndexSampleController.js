(function () {
    'use strict';

    var controllerId = 'sectorIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', sectorIndexSampleController]);

    function sectorIndexSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.authorized = false; // TODO Improve this 'authorized' part?

        userService.getUserInfo()
            .then(function (userInfo) {

                vm.authorized = true;

                initialize();
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.authorized = false;
        });

        /*** Implementations ***/

        function initialize() {

            // ?
            vm.sectorIndex_SampleResourcePoolId = 4;
        }
    };
})();
