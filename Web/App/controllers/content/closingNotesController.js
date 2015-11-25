(function () {
    'use strict';

    var controllerId = 'closingNotesController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$scope', '$sce', '$location', 'logger', closingNotesController]);

    function closingNotesController(userFactory, $scope, $sce, $location, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.isLocalhost = $location.$$host === 'localhost';
        vm.displayBankTransfer = false;
        vm.toggleBankTransfer = function () {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }

        vm.isAuthenticated = false;
        userFactory.isAuthenticated()
            .then(function (isAuthenticated) {
                vm.isAuthenticated = isAuthenticated;
            });

        // User logged in & out
        $scope.$on('userLoggedIn', function () {
            vm.isAuthenticated = true;
        });

        $scope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });

        //vm.flattrIFrameUrl = $sce.trustAsResourceUrl('//api.flattr.com/button/view/?uid=forCrowd&button=compact&url=' + encodeURIComponent($location.$$absUrl));
    };
})();
