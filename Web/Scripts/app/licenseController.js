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

    angular.module('main')
        .controller('LicenseController', ['dataContext', 'logger', '$scope', '$http', '$location', '$route', '$routeParams', LicenseController]);

    function LicenseController(dataContext, logger, $scope, $http, $location, $route, $routeParams) {

        logger = logger.forSource('LicenseController');
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var currentRoute = $route.current.originalPath;

        $scope.isCreating = false;
        $scope.isEditing = false;
        $scope.isListing = false;

        $scope.license = new Object();
        $scope.licenseSet = [];
        $scope.saveLicense = saveLicense;
        $scope.deleteLicense = deleteLicense;

        initialize();

        function initialize() {
            if (currentRoute === '/new') // New
            {
                $scope.license.Name = "Name";
                $scope.license.Description = "Description";
                $scope.license.Text = "Text";

                $scope.isCreating = true;

            }
            else if (currentRoute === '/edit/:Id') // Edit
            {
                getLicense($routeParams.Id);

                $scope.isEditing = true;
            }
            else // List
            {
                getLicenseSet();

                $scope.isListing = true;
            }
        };

        function isFetchRequired() {
            var currentTime = new Date();
            var diff = (currentTime - $scope.fetchedOn);
            return diff > fetchInterval;
        }

        function getLicense(licenseId) {

            // TODO Try to retrieve it from licenseSet
            // TODO Exception ?!
            dataContext.getLicense(licenseId)
                .then(function (data) {
                    $scope.license = data[0];
                });
        };

        function getLicenseSet(forceRefresh) {
            return dataContext.getLicenseSet(forceRefresh).then(function (data) {
                return $scope.licenseSet = data;
            });
        }

        function saveLicense() {

            if ($scope.isCreating)
                dataContext.createLicense($scope.license);

            saveChanges(true);
        };

        function deleteLicense(licenseIndex) {
            var license = $scope.licenseSet[licenseIndex];
            $scope.licenseSet.splice(licenseIndex, 1);
            dataContext.deleteLicense(license);

            saveChanges(false);
        };

        function saveChanges(isEditing) {

            // isSaving = true;
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
                    // isSaving = false;
                });
        }
    };
})();