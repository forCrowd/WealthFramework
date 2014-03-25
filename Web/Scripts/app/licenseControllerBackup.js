
  //angular.module('app').controller('main',
  //[ 'logger', 'datacontext', controller]);


angular.module('main')

.controller('LicenseListCtrl',
// ['datacontext', function ($scope, $http, $location) {
function ($scope, $http, $location) {

    $http.get('/odata/License/').success(function (data) {
        $scope.licenseSet = data.value;
    })
    .error(function () {
        $scope.error = "An error has occured while loading items!";
    });

    $scope.delete = function (licenseIndex) {

        var license = $scope.licenseSet[licenseIndex];

        $http.delete('/odata/License(' + license.Id + ')').success(function (data) {
            $scope.licenseSet.splice(licenseIndex, 1);
        }).error(function (data) {
            $scope.error = "An error has occured while deleting the item!" + data;
        });
    };
}
//]
)

.controller('LicenseCreateCtrl', function ($scope, $http, $location, $timeout) {

    $scope.save = function () {
        $http.post('/odata/License/', $scope.license).success(function (data) {
            $location.path('/');
        }).error(function (data) {
            $scope.error = "An error has occured while saving the item! " + data;
        });
    };
})

.controller('LicenseEditCtrl', function ($scope, $http, $location, $routeParams) {

    $http.get('/odata/License(' + $routeParams.Id + ')').success(function (data) {
        $scope.license = data;
    })
    .error(function () {
        $scope.error = "An error has occured while loading the item!";
    });

    $scope.save = function () {
        $http.put('/odata/License(' + $routeParams.Id + ')', $scope.license).success(function (data) {
            $location.path('/');
        }).error(function (data) {
            $scope.error = "An error has occured while saving the item! " + data;
        });
    };
});
