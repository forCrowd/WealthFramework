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

    var controllerId = 'LicenseController';
    angular.module('main')
        .controller(controllerId, ['dataContext', 'logger', '$location', '$route', '$routeParams', LicenseController]);

    function LicenseController(dataContext, logger, $location, $route, $routeParams) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var currentRoute = $route.current.originalPath;
        var isSaving = false; // Currently not in use

        var vm = this;
        vm.isCreating = false;
        vm.isEditing = false;
        vm.isListing = false;

        vm.license = new Object();
        vm.licenseSet = [];
        vm.saveLicense = saveLicense;
        vm.deleteLicense = deleteLicense;

        initialize();

        function initialize() {
            if (currentRoute === '/new') // New
            {
                vm.license.Name = "Name";
                vm.license.Description = "Description";
                vm.license.Text = "Text";

                vm.isCreating = true;

            }
            else if (currentRoute === '/edit/:Id') // Edit
            {
                getLicense($routeParams.Id);

                vm.isEditing = true;
            }
            else // List
            {
                getLicenseSet();

                vm.isListing = true;
            }
        };

        function getLicense(licenseId) {

            // TODO Try to retrieve it from licenseSet
            // TODO Exception ?!
            dataContext.getLicense(licenseId)
                .then(function (data) {
                    vm.license = data[0];
                });
        };

        function getLicenseSet(forceRefresh) {
            return dataContext.getLicenseSet(forceRefresh).then(function (data) {
                return vm.licenseSet = data;
            });
        }

        function saveLicense() {

            if (vm.isCreating)
                dataContext.createLicense(vm.license);

            saveChanges(true);
        };

        function deleteLicense(licenseIndex) {
            var license = vm.licenseSet[licenseIndex];
            vm.licenseSet.splice(licenseIndex, 1);
            dataContext.deleteLicense(license);

            saveChanges(false);
        };

        function saveChanges(isEditing) {

            isSaving = true;
            return dataContext.save()
                .then(function () {

                    logSuccess("Hooray we saved", null, true);
                    if (isEditing) {
                        $location.path('/');
                    }
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
            return dataContext.save()
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
        .controller(controllerId, ['dataContext', 'logger', '$location', '$routeParams', LicenseEditController]);

    function LicenseEditController(dataContext, logger, $location, $routeParams) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var isSaving = false; // Currently not in use
        var isNew = $location.path() === '/new2';

        var vm = this;
        vm.license = null;
        vm.saveLicense = saveLicense;

        initialize();

        function initialize() {
            if (isNew) {

                // TODO Only development
                vm.license = {
                    Name: "Name",
                    Description: "Description",
                    Text: "Text"
                };
            }
            else {
                getLicense($routeParams.Id);
            }
        };

        function getLicense(licenseId) {

            // TODO Try to retrieve it from licenseSet
            // TODO Exception ?!
            dataContext.getLicense(licenseId)
                .then(function (data) {
                    vm.license = data[0];
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                });
        };

        function saveLicense() {

            if (isNew)
                dataContext.createLicense(vm.license);

            saveChanges();
        };

        function saveChanges() {

            isSaving = true;
            return dataContext.save()
                .then(function () {
                    logSuccess("Hooray we saved", null, true);
                    $location.path('/list2');
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