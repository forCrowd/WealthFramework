(function () {
    'use strict';

    var controllerId = 'AccountEditController';
    angular.module('main')
        .controller(controllerId, ['userFactory',
            'logger',
            AccountEditController]);

    function AccountEditController(userFactory,
		logger) {
        logger = logger.forSource(controllerId);

        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.isSaveDisabled = isSaveDisabled;
        vm.user = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        // Get current user
        userFactory.getCurrentUser()
            .then(function (currentUser) {
                vm.user = currentUser;
            });

        /*** Implementations ***/

        function hasChanges() {
            return userFactory.hasChanges();
        }

        function isSaveDisabled() {
            //return isSaving || (!userFactory.hasChanges());
            return isSaving;
        }

        function saveChanges() {

            isSaving = true;
            userFactory.saveChanges()
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
    }
})();
