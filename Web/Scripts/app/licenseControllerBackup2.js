
angular.module('main')
    .controller('LicenseBreezeController', ['$scope', 'datacontext', LicenseBreezeController]);

function LicenseBreezeController($scope, datacontext) {

    var vm = this;
    vm.LicenseSet = [];
    vm.TestProp = 'vm test prop 2';

    initialize();

    function initialize() {
        console.log("initialize");
        getLicenseSet();
    };

    function getLicenseSet(forceRefresh) {
        return datacontext.getLicenseSet(forceRefresh).then(function (data) {
            // vm.TestProp = "test prop";
            console.log("licenseController - getLicenseSet");

            console.log(data[0]);

            // console.log(data);
            //console.log(vm.TestProp);
            // return $scope.LicenseSet = data;
            return vm.LicenseSet = data;
        });
    }
}

angular.module('main')
    .controller('LicenseListCtrl', ['datacontext', '$scope', '$http', '$location', LicenseListCtrl])
    .controller('LicenseCreateCtrl', ['datacontext', '$scope', '$http', '$location', LicenseCreateCtrl])
    .controller('LicenseEditCtrl', ['datacontext', '$scope', '$http', '$location', '$routeParams', LicenseEditCtrl]);

function LicenseListCtrl(datacontext, $scope, $http, $location) {

    // var vm = this;
    $scope.licenseSet = [];
    //vm.TestProp = 'vm test prop 2';

    initialize();

    function initialize() {
        console.log("initialize");
        getLicenseSet();
    };

    function getLicenseSet(forceRefresh) {
        return datacontext.getLicenseSet(forceRefresh).then(function (data) {
            console.log("licenseController - getLicenseSet");
            // console.log(data);
            return $scope.licenseSet = data;
        });
    }

    //$http.get('/odata/License/').success(function (data) {
    //    $scope.licenseSet = data.value;
    //})
    //.error(function () {
    //    $scope.error = "An error has occured while loading items!";
    //});

    $scope.delete = function (licenseIndex) {

        console.log('deleted');

        var license = $scope.licenseSet[licenseIndex];
        $scope.licenseSet.splice(licenseIndex, 1);
        datacontext.deleteLicense(license);
        console.log(license)
        datacontext.save();

        //$http.delete('/odata/License(' + license.Id + ')').success(function (data) {
        //    $scope.licenseSet.splice(licenseIndex, 1);
        //}).error(function (data) {
        //    $scope.error = "An error has occured while deleting the item!" + data;
        //});
    };

    $scope.save = save;

    function save() {

        console.log('saving');

        // isSaving = true;
        return datacontext.save()
            .then(function () {
                console.log('saved');
                // logSuccess("Hooray we saved", null, true);
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

function LicenseCreateCtrl(datacontext, $scope, $http, $location) {

    $scope.license = new Object();
    $scope.license.Name = "Name";
    $scope.license.Description = "Description";
    $scope.license.Text = "Text";

    $scope.save = save;

    function save() {

        console.log('saving');

        datacontext.createLicense($scope.license);

        // isSaving = true;
        return datacontext.save()
            .then(function () {
                console.log('saved');
                // logSuccess("Hooray we saved", null, true);
                $location.path('/');
            })
            .catch(function (error) {
                console.log(error);
                // logError("Boooo, we failed: " + error.message, null, true);
                // Todo: more sophisticated recovery. 
                // Here we just blew it all away and start over
                // refresh();
            })
            .finally(function () {
                // isSaving = false;
            });
    }

    //$scope.save = function () {
    //    $http.post('/odata/License/', $scope.license).success(function (data) {
    //        $location.path('/');
    //    }).error(function (data) {
    //        $scope.error = "An error has occured while saving the item! " + data;
    //    });
    //};
};

function LicenseEditCtrl(datacontext, $scope, $http, $location, $routeParams) {

    // $scope.load = getLicense;

    $scope.testProp2 = "test";
    $scope.license = new Object();

    // function getLicense() {
    datacontext.getLicense($routeParams.Id).then(function (data) {
        // vm.TestProp = "test prop";
        console.log("licenseController - getLicense with Id: " + $routeParams.Id);

        // console.log(data);
        //console.log(vm.TestProp);
        // return $scope.LicenseSet = data;
        $scope.license = data[0];
    });

    // };

    //$http.get('/odata/License(' + $routeParams.Id + ')').success(function (data) {
    //    $scope.license = data;
    //})
    //.error(function () {
    //    $scope.error = "An error has occured while loading the item!";
    //});

    $scope.save = save;

    //$scope.save = function () {
    //    $http.put('/odata/License(' + $routeParams.Id + ')', $scope.license).success(function (data) {
    //        $location.path('/');
    //    }).error(function (data) {
    //        $scope.error = "An error has occured while saving the item! " + data;
    //    });
    //};

    function save() {

        console.log('saving');

        // datacontext.createLicense($scope.license);

        // isSaving = true;
        return datacontext.save()
            .then(function () {
                console.log('saved');
                // logSuccess("Hooray we saved", null, true);
                $location.path('/');
            })
            .catch(function (error) {
                console.log(error);
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
