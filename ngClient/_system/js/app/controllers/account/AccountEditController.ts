module Main.Controller {
    'use strict';

    var controllerId = 'AccountEditController';

    export class AccountEditController {

        static $inject = ['dataContext', 'logger', '$location'];

        constructor(dataContext: any, logger: any, $location: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var isSaving = false;

            // Controller methods (alphabetically)
            var vm: any = this;
            vm.cancel = cancel;
            vm.currentUser = dataContext.getCurrentUser();
            vm.isSaveDisabled = isSaveDisabled;
            vm.saveChanges = saveChanges;

            /*** Implementations ***/

            function cancel() {
                vm.currentUser.entityAspect.rejectChanges();
                $location.url('/_system/account');
            }

            function isSaveDisabled() {
                //return isSaving || (!dataContext.hasChanges());
                return isSaving;
            }

            function saveChanges() {

                isSaving = true;
                dataContext.saveChanges()
                    .then(result => {
                        logger.logSuccess('Your changes have been saved!', null, true);
                        $location.url('/_system/account');
                    })
                    .catch(error => {

                        // Conflict (Concurrency exception)
                        if (error.status === '409') {
                            // TODO Try to recover!
                        }
                    })
                    .finally(() => {
                        isSaving = false;
                    });
            }            
        }
    }

    angular.module('main').controller(controllerId, AccountEditController);
}