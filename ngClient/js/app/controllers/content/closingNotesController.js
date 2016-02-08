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
        vm.currentUser = { isAuthenticated: function () { return false; } };
        vm.isLocalhost = $location.$$host === 'localhost';
        vm.displayBankTransfer = false;
        vm.toggleBankTransfer = toggleBankTransfer;

        vm.disqusShortname = disqusShortname;
        vm.disqusId = 'wealth_economy_11'; // ?
        vm.disqusUrl = $location.url(); // ?

        $scope.$on('userFactory_currentUserChanged', function (event, newUser) {
            vm.currentUser = newUser;
        });

        _init();

        function _init() {
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                });
        }

        function toggleBankTransfer() {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }

        //vm.flattrIFrameUrl = $sce.trustAsResourceUrl('//api.flattr.com/button/view/?uid=forCrowd&button=compact&url=' + encodeURIComponent($location.$$absUrl));
    }
})();
