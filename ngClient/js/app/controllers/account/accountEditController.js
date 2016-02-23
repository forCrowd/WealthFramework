(function () {
    'use strict';

    var controllerId = 'AccountEditController';
    angular.module('main')
        .controller(controllerId, ['userFactory', 'logger', AccountEditController]);

    function AccountEditController(userFactory, logger) {
        logger = logger.forSource(controllerId);

        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.user = null;
        vm.saveChanges = saveChanges;

        // Get current user
        userFactory.getCurrentUser()
            .then(function (currentUser) {
                vm.user = currentUser;
                vm.user.isEditing = true;
            });

        /*** Implementations ***/

        function cancelChanges() {
            // TODO
        }

        function isSaveDisabled() {
            //return isSaving || (!userFactory.hasChanges());
            return isSaving;
        }

        function saveChanges() {

            isSaving = true;
            vm.user.isEditing = false;
            userFactory.saveChanges()
                .then(function (result) {
                    logger.logSuccess('Your changes have been saved!', null, true);
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
    }
})();
