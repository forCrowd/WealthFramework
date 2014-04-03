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

    var controllerId = 'licenseListController';
    angular.module('main')
        .controller(controllerId, ['licenseService', 'logger', licenseListController]);

    function licenseListController(licenseService, logger) {

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

        function deleteLicense(license) {
            licenseService.deleteLicense(license);

            licenseService.saveChanges()
                .then(function () {
                    vm.licenseSet.splice(vm.licenseSet.indexOf(license));
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function deleteLicense2(licenseIndex) {
            var license = vm.licenseSet[licenseIndex];
            licenseService.deleteLicense(license);

            licenseService.saveChanges()
                .then(function () {
                    vm.licenseSet.splice(licenseIndex, 1);
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getLicenseSet(forceRefresh) {
            return licenseService.getLicenseSet(forceRefresh).then(function (data) {
                return vm.licenseSet = data;
            });
        }
    };

    var controllerId = 'licenseEditController';
    angular.module('main')
        .controller(controllerId, ['licenseService', 'logger', '$location', '$routeParams', '$timeout', licenseEditController]);

    function licenseEditController(licenseService, logger, $location, $routeParams, $timeout) {

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

            if (licenseService.hasChanges()) {
                licenseService.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return licenseService.hasChanges();
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
                licenseService.getLicense($routeParams.Id)
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
                (!isNew && !licenseService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                licenseService.createLicense(vm.license);
            }

            isSaving = true;
            return licenseService.saveChanges()
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