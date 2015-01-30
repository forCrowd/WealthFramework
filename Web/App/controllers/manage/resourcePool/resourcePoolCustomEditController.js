(function () {
    'use strict';

    var controllerId = 'resourcePoolCustomEditController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            'logger',
            '$location',
            '$routeParams',
            resourcePoolCustomEditController]);

    function resourcePoolCustomEditController(resourcePoolService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/resourcePool/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.resourcePool = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/resourcePool');

            //if (resourcePoolService.hasChanges()) {
            //    resourcePoolService.rejectChanges();
            //    logWarning('Discarded pending change(s)', null, true);
            //}
        }

        function hasChanges() {
            return resourcePoolService.hasChanges();
        }

        function initialize() {

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                resourcePoolService.getResourcePoolCustomEdit($routeParams.Id)
                    .then(function (data) {
                        vm.resourcePool = data[0].ResourcePool;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !resourcePoolService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                resourcePoolService.createResourcePool(vm.resourcePool);
            } else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
                // Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.resourcePool.RowVersion;
                vm.resourcePool.RowVersion = '';
                vm.resourcePool.RowVersion = rowVersion;
            }

            isSaving = true;
            resourcePoolService.saveChanges()
                .then(function (result) {
                    $location.path('/manage/resourcePool');
                })
                .catch(function (error) {
                    // Conflict (Concurrency exception)
                    if (error.status !== 'undefined' && error.status === '409') {
                        // TODO Try to recover!
                    } else if (error.entityErrors !== 'undefined') {
                        vm.entityErrors = error.entityErrors;
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();
