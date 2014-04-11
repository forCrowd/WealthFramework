(function () {
    'use strict';

    var controllerId = 'userResourcePoolController';
    angular.module('main')
        .controller(controllerId, ['userService', 'logger', userResourcePoolController]);

    function userResourcePoolController(userService, logger) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        logSuccess('userResourcePoolController', null, true);

        var vm = this;
        // vm.deleteUserResourcePool = deleteUserResourcePool;
        vm.userResourcePoolSet = [];

        initialize();

        function initialize() {
            getUserResourcePoolSet();

        };

        //function deleteUserResourcePool(userResourcePool) {
        //    userResourcePoolService.deleteUserResourcePool(userResourcePool);

        //    userResourcePoolService.saveChanges()
        //        .then(function () {
        //            vm.userResourcePoolSet.splice(vm.userResourcePoolSet.indexOf(userResourcePool), 1);
        //            logSuccess("Hooray we saved", null, true);
        //        })
        //        .catch(function (error) {
        //            logError("Boooo, we failed: " + error.message, null, true);
        //            // Todo: more sophisticated recovery. 
        //            // Here we just blew it all away and start over
        //            // refresh();
        //        })
        //};

        function getUserResourcePoolSet() {

            logSuccess('getUserResourcePoolSet', null, true);

            return userService.getUserResourcePoolSet(1, userService, logger).then(function (data) {
                logSuccess('data', data[0], true);
                return vm.userResourcePool = data[0];
            });
        }
    };
})();
