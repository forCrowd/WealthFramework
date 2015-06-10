(function () {
    'use strict';

    var controllerId = 'accountEditController';
    angular.module('main')
        .controller(controllerId, ['userService',
            'logger',
            accountEditController]);

    function accountEditController(userService,
		logger) {
        logger = logger.forSource(controllerId);

        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.isSaveDisabled = isSaveDisabled;
        vm.user = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function hasChanges() {
            return userService.hasChanges();
        }

        function initialize() {

            userService.getCurrentUser()
                .then(function (currentUser) {

                    vm.user = currentUser;

                }, function () {
                    // TODO Error?
                });
        };

        function isSaveDisabled() {
            return isSaving ||
                (!userService.hasChanges());
        }

        function saveChanges() {

            isSaving = true;
            userService.saveChanges()
                .then(function (result) {
                    logger.logSuccess('Your changes has been saved!', null, true);
                })
                .catch(function (error) {
                    // Conflict (Concurrency exception)
                    if (error.status === '409') {
                        // TODO Try to recover!
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();
