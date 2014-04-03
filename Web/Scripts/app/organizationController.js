/***
 * Controller/ViewModel: OrganizationController
 *
 * Support a view of OrganizationSet
 *
 * Handles fetch and save of these lists
 *
 ***/
(function () {
    'use strict';

    var controllerId = 'organizationListController';
    angular.module('main')
        .controller(controllerId, ['organizationService', 'logger', organizationListController]);

    function organizationListController(organizationService, logger) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var vm = this;
        vm.deleteOrganization = deleteOrganization;
        vm.organizationSet = [];

        initialize();

        function initialize() {
            getOrganizationSet();
        };

        function deleteOrganization(organization) {
            organizationService.deleteOrganization(organization);

            organizationService.saveChanges()
                .then(function () {
                    vm.organizationSet.splice(vm.organizationSet.indexOf(organization), 1);
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getOrganizationSet(forceRefresh) {
            return organizationService.getOrganizationSet(forceRefresh).then(function (data) {
                return vm.organizationSet = data;
            });
        }
    };

    var controllerId = 'organizationEditController';
    angular.module('main')
        .controller(controllerId, ['organizationService', 'licenseService', 'sectorService', 'logger', '$location', '$routeParams', organizationEditController]);

    function organizationEditController(organizationService, licenseService, sectorService, logger, $location, $routeParams) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var isNew = $location.path() === '/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.licenseSet = [];
        vm.sectorSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.organization = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/');

            if (organizationService.hasChanges()) {
                organizationService.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return organizationService.hasChanges();
        }

        function initialize() {

            // License set
            licenseService.getLicenseSet()
                .then(function (data) {
                    vm.licenseSet = data;
                });

            // TODO Catch?

            // Sector set
            sectorService.getSectorSet()
                .then(function (data) {
                    vm.sectorSet = data;
                });

            // TODO Catch?

            if (isNew) {
                // TODO Only development ?!
                vm.organization = {
                    SectorId: 1,
                    Name: "Name",
                    ProductionCost: 100,
                    SalesPrice: 200,
                    LicenseId: 1
                };
            }
            else {
                organizationService.getOrganization($routeParams.Id)
                    .then(function (data) {
                        vm.organization = data;
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
                (!isNew && !organizationService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                organizationService.createOrganization(vm.organization);
            }

            isSaving = true;
            return organizationService.saveChanges()
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