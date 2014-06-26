(function () {
    'use strict';

    var controllerId = 'accountEditController';
    angular.module('main')
        .controller(controllerId, ['userService',
            'logger',
            //'$location',
            '$routeParams',
            accountEditController]);

    function accountEditController(userService,
		logger,
		//$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        // var isNew = $location.path() === '/User/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        //vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.user = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        //function cancelChanges() {

        //    $location.path('/User');

        //    if (userService.hasChanges()) {
        //        userService.rejectChanges();
        //        logWarning('Discarded pending change(s)', null, true);
        //    }
        //}

        function hasChanges() {
            return userService.hasChanges();
        }

        function initialize() {

            //if (isNew) {
            //    // TODO For development enviroment, create test entity?
            //}
            //else {
                userService.getUser($routeParams.Id)
                    .then(function (data) {
                        vm.user = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            //}
        };

        function isSaveDisabled() {
            return isSaving ||
                (!userService.hasChanges());
                //(!isNew && !userService.hasChanges());
        }

        function saveChanges() {

            //if (isNew) {
            //    userService.createUser(vm.user);
            //} else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
                // Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.user.RowVersion;
                vm.user.RowVersion = '';
                vm.user.RowVersion = rowVersion;
            //}

            isSaving = true;
            userService.saveChanges()
                .then(function (result) {
                    logger.logSuccess('Your changes has been saved!', null, true);
                    //$location.path('/User');
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
