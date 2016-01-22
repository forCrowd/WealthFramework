(function () {
    'use strict';

    var controllerId = 'ClosingNotesController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$scope', '$sce', '$location', 'disqusShortname', 'logger', ClosingNotesController]);

    function ClosingNotesController(userFactory, $scope, $sce, $location, disqusShortname, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.isAuthenticated = false;
        vm.isLocalhost = $location.$$host === 'localhost';
        vm.displayBankTransfer = false;
        vm.toggleBankTransfer = toggleBankTransfer;

        vm.disqusShortname = disqusShortname;
        vm.disqusId = 'wealth_economy_11'; // ?
        vm.disqusUrl = $location.url(); // ?

        _init();

        // User logged in & out
        $scope.$on('userLoggedIn', function () {
            vm.isAuthenticated = true;
        });

        $scope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });

        function _init() {
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    vm.isAuthenticated = currentUser.isAuthenticated();
                });
        }

        function toggleBankTransfer() {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }

        //vm.flattrIFrameUrl = $sce.trustAsResourceUrl('//api.flattr.com/button/view/?uid=forCrowd&button=compact&url=' + encodeURIComponent($location.$$absUrl));
    }
})();
