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
        //vm.userInfo = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function hasChanges() {
            return userService.hasChanges();
        }

        function initialize() {

                userService.getUserInfo()
                    .then(function (userInfo) {
                        // vm.userInfo = userInfo;

                        userService.getUser(userInfo.Id)
                            .then(function (data) {
                                vm.user = data;
                            })
                            .catch(function (error) {
                                // TODO User-friendly message?
                            });

                    }, function () {
                        // TODO Error?
                    });
                };

        function isSaveDisabled() {
            return isSaving ||
                (!userService.hasChanges());
        }

        function saveChanges() {

                // To be able to do concurrency check, RowVersion field needs to be send to server
                // Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.user.RowVersion;
                vm.user.RowVersion = '';
                vm.user.RowVersion = rowVersion;

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
