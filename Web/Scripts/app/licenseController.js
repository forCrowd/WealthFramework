
angular.module('main')
    .controller('LicenseController', ['datacontext', '$scope', '$http', '$location', '$route', '$routeParams', LicenseController])
    .controller('LicenseCreateCtrl', ['datacontext', '$scope', '$http', '$location', '$route', LicenseCreateCtrl])
    .controller('LicenseEditCtrl', ['datacontext', '$scope', '$http', '$location', '$route', '$routeParams', LicenseEditCtrl]);

function LicenseController(datacontext, $scope, $http, $location, $route, $routeParams) {

    var currentRoute = $route.current.originalPath;

    console.log('LicenseController');
    console.log('currentRoute: ' + currentRoute);

    var fetchInterval = 1000 * 60 * 30;
    $scope.fetchedOn = new Date(0);
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
            console.log('getLicenseSet');

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
        datacontext.getLicense(licenseId)
            .then(function (data) {
                $scope.license = data[0];
            });
    };

    function getLicenseSet(forceRefresh) {
        return datacontext.getLicenseSet(forceRefresh).then(function (data) {
            return $scope.licenseSet = data;
        });
    }

    function saveLicense() {

        if ($scope.isCreating)
            datacontext.createLicense($scope.license);

        saveChanges(true);
    };

    function deleteLicense(licenseIndex) {
        var license = $scope.licenseSet[licenseIndex];
        $scope.licenseSet.splice(licenseIndex, 1);
        datacontext.deleteLicense(license);

        saveChanges(false);
    };

    function saveChanges(isEditing) {

        // isSaving = true;
        return datacontext.save()
            .then(function () {

                console.log('saveChanges');

                // logSuccess("Hooray we saved", null, true);
                if (isEditing) {
                    $location.path('/');
                }
            })
            .catch(function (error) {
                // logError("Boooo, we failed: " + error.message, null, true);
                // Todo: more sophisticated recovery. 
                // Here we just blew it all away and start over
                // refresh();
            })
            .finally(function () {
                // isSaving = false;
            });
    }
};

function LicenseCreateCtrl(datacontext, $scope, $http, $location, $route) {

    console.log($route);
    console.log($location);

    console.log($route.current.originalPath === '/');
    console.log($route.current.originalPath === '/new');
    console.log($route.current.originalPath === '/edit/:Id');

    $scope.license = new Object();
    $scope.license.Name = "Name";
    $scope.license.Description = "Description";
    $scope.license.Text = "Text";

    $scope.save = save;

    function save() {

        datacontext.createLicense($scope.license);

        // isSaving = true;
        return datacontext.save()
            .then(function () {
                // logSuccess("Hooray we saved", null, true);
                $location.path('/');
            })
            .catch(function (error) {
                // logError("Boooo, we failed: " + error.message, null, true);
                // Todo: more sophisticated recovery. 
                // Here we just blew it all away and start over
                // refresh();
            })
            .finally(function () {
                // isSaving = false;
            });
    }
};

function LicenseEditCtrl(datacontext, $scope, $http, $location, $route, $routeParams) {

    console.log($route);
    console.log($location);

    console.log($route.current.originalPath === '/');
    console.log($route.current.originalPath === '/new');
    console.log($route.current.originalPath === '/edit/:Id');

    datacontext.getLicense($routeParams.Id).then(function (data) {
        // TODO Get it from local
        $scope.license = data[0];
    });

    $scope.save = save;

    function save() {
        // isSaving = true;
        return datacontext.save()
            .then(function () {
                // logSuccess("Hooray we saved", null, true);
                $location.path('/');
            })
            .catch(function (error) {
                // logError("Boooo, we failed: " + error.message, null, true);
                // Todo: more sophisticated recovery. 
                // Here we just blew it all away and start over
                // refresh();
            })
            .finally(function () {
                // isSaving = false;
            });
    }
};
