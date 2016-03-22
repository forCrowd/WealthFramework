(function () {
    'use strict';

    var controllerId = 'AccountEditController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', AccountEditController]);

    function AccountEditController(dataContext, logger, $location) {
        logger = logger.forSource(controllerId);

        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.cancel = cancel;
        vm.isSaveDisabled = isSaveDisabled;
        vm.currentUser = null;
        vm.saveChanges = saveChanges;

        // Get current user
        dataContext.getCurrentUser()
            .then(function (currentUser) {
                vm.currentUser = currentUser;
                vm.currentUser.isEditing = true;
            });

        /*** Implementations ***/

        function cancel() {
            vm.currentUser.entityAspect.rejectChanges();
            vm.currentUser.isEditing = false;
            $location.url('/_system/account');
        }

        function isSaveDisabled() {
            //return isSaving || (!dataContext.hasChanges());
            return isSaving;
        }

        function saveChanges() {

            isSaving = true;
            vm.currentUser.isEditing = false; // TODO What happens in fail case?
            dataContext.saveChanges()
                .then(function (result) {
                    logger.logSuccess('Your changes have been saved!', null, true);
                    $location.url('/_system/account');
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
