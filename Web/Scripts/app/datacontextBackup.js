(function () {

    angular.module('main').factory('datacontext',
           ['$http', 'breeze', datacontext]);

    function datacontext($http, $scope) {

        // use Web API OData to query and save
        breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);

        // convert server PascalCase property names to camelCase
        breeze.NamingConvention.camelCase.setAsDefault();

        // create a new manager talking to sample service 
        // var host = "http://sampleservice.breezejs.com";
        var host = ''
        var serviceName = host + "/odata";
        var manager = new breeze.EntityManager(serviceName);

        // plunkerHelpers.isCorsCapable();

        var service = {
            getAllTodos: getAllTodos,
            reset: reset
        };
        return service;

        /*** implementation ***/

        function getAllTodos() {
            return breeze.EntityQuery.from("License")
                  .using(manager).execute()
                  .then(success);

            function success(data) {
                return data.results;
            }
        }

        function reset() {
            manager.clear();

            return $http.post(serviceName + '/reset')
             .then(resetSuccess)
             .catch(resetFail);

            function resetSuccess() {
            }

            function resetFail() {
                throw new Error("Database reset failed");
            }
        }
    }

})();