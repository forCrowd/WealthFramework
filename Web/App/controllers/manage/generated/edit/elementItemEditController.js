//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

(function () {
    'use strict';

    var controllerId = 'elementItemEditController';
    angular.module('main')
        .controller(controllerId, ['elementItemFactory',
            'elementFactory',
            'logger',
            '$location',
            '$routeParams',
            elementItemEditController]);

    function elementItemEditController(elementItemFactory,
		elementFactory,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/generated/elementItem/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.elementSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.elementItem = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/generated/elementItem');

            //if (elementItemFactory.hasChanges()) {
            //    elementItemFactory.rejectChanges();
            //    logWarning('Discarded pending change(s)', null, true);
            //}
        }

        function hasChanges() {
            return elementItemFactory.hasChanges();
        }

        function initialize() {

            elementFactory.getElementSet(false)
                .then(function (data) {
                    vm.elementSet = data;
                });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                elementItemFactory.getElementItem($routeParams.Id)
                    .then(function (data) {
                        vm.elementItem = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !elementItemFactory.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                elementItemFactory.createElementItem(vm.elementItem);
            }

            isSaving = true;
            elementItemFactory.saveChanges()
                .then(function (result) {
                    $location.path('/manage/generated/elementItem');
                })
                .catch(function (error) {
                    // Conflict (Concurrency exception)
                    if (typeof error.status !== 'undefined' && error.status === '409') {
                        // TODO Try to recover!
                    } else if (typeof error.entityErrors !== 'undefined') {
                        vm.entityErrors = error.entityErrors;
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();
