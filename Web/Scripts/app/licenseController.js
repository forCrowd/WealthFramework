/***
 * Controller/ViewModel: LicenseController
 *
 * Support a view of LicenseSet
 *
 * Handles fetch and save of these lists
 *
 ***/
(function () {
    'use strict';

    var controllerId = 'LicenseListController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', LicenseListController]);

    function LicenseListController(dataContext, logger) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var vm = this;
        vm.deleteLicense = deleteLicense;
        vm.licenseSet = [];

        initialize();

        function initialize() {
            getLicenseSet();
        };

        function deleteLicense(licenseIndex) {
            var license = vm.licenseSet[licenseIndex];
            vm.licenseSet.splice(licenseIndex, 1);
            dataContext.deleteLicense(license);

            saveChanges();
        };

        function getLicenseSet(forceRefresh) {
            return dataContext.getLicenseSet(forceRefresh).then(function (data) {
                return vm.licenseSet = data;
            });
        }

        function saveChanges() {
            return dataContext.saveChanges()
                .then(function () {
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        }
    };

    var controllerId = 'LicenseEditController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', '$routeParams', '$timeout', LicenseEditController]);

    function LicenseEditController(dataContext, logger, $location, $routeParams, $timeout) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var isNew = $location.path() === '/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.license = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {
            
            $location.path('/');

            if (dataContext.hasChanges()) {
                dataContext.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return dataContext.hasChanges();
        }

        function initialize() {
            if (isNew) {
                // TODO Only development ?!
                vm.license = {
                    Name: "Name",
                    Description: "Description",
                    Text: "Text"
                };
            }
            else {
                // TODO Try to retrieve it from licenseSet
                logger.logWarning($routeParams.Id, null, true);

                dataContext.getLicense($routeParams.Id)
                    .then(function (data) {
                        vm.license = data;
                    })
                    .catch(function (error) {
                        logError("Boooo, we failed: " + error.message, null, true);
                        // Todo: more sophisticated recovery. 
                        // Here we just blew it all away and start over
                        // refresh();
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !dataContext.hasChanges());
        }

        function saveChanges() {

            if (isNew)
                dataContext.createLicense(vm.license);

            isSaving = true;
            return dataContext.saveChanges()
                .then(function () {
                    logSuccess("Hooray we saved", null, true);
                    $location.path('/');
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();