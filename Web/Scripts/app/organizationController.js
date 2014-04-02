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
        .controller(controllerId, ['organizationManager', 'logger', organizationListController]);

    function organizationListController(organizationManager, logger) {

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
            organizationManager.deleteOrganization(organization);

            organizationManager.saveChanges()
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
            return organizationManager.getOrganizationSet(forceRefresh).then(function (data) {
                return vm.organizationSet = data;
            });
        }
    };

    var controllerId = 'organizationEditController';
    angular.module('main')
        .controller(controllerId, ['organizationManager', 'logger', '$location', '$routeParams', '$timeout', organizationEditController]);

    function organizationEditController(organizationManager, logger, $location, $routeParams, $timeout) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var isNew = $location.path() === '/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.LicenseSet = [];
        vm.SectorSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.organization = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/');

            if (organizationManager.hasChanges()) {
                organizationManager.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return organizationManager.hasChanges();
        }

        function initialize() {

            organizationManager.getLicenseSet()
                .then(function (licenseSet) {

                    vm.LicenseSet = licenseSet;

                    organizationManager.getSectorSet()
                        .then(function (sectorSet) {

                            vm.SectorSet = sectorSet;

                        }).catch(function (error) {
                            /* TODO ?! */
                        });
                }).catch(function (error) {
                    /* TODO ?! */
                });

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
                organizationManager.getOrganization($routeParams.Id)
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
                (!isNew && !organizationManager.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                organizationManager.createOrganization(vm.organization);
            }

            isSaving = true;
            return organizationManager.saveChanges()
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