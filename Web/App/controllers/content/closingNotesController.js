(function () {
    'use strict';

    var controllerId = 'closingNotesController';
    angular.module('main')
        .controller(controllerId, ['$sce', '$location', 'logger', closingNotesController]);

    function closingNotesController($sce, $location, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.isLocalhost = $location.$$host === 'localhost';
        //vm.isLocalhost = false;
        //logger.log('vm.isLocalhost', vm.isLocalhost);
        //vm.flattrIFrameUrl = $sce.trustAsResourceUrl('//api.flattr.com/button/view/?uid=forCrowd&button=compact&url=' + encodeURIComponent($location.$$absUrl));
    };
})();
