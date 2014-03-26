/***
 * Service: entityManagerFactory 
 *
 * Configures BreezeJS and creates new instance(s) of the 
 * BreezeJS EntityManager for use in a 'dataContext' service
 *
 ***/
(function () {
    'use strict';

    var serviceId = 'entityManagerFactory';
    angular.module('main')
           .factory(serviceId, ['breeze', entityManagerFactory]);

    function entityManagerFactory(breeze) {
        configureBreeze();
        var serviceRoot = window.location.protocol + '//' + window.location.host + '/';
        var serviceName = serviceRoot + 'odata/';
        var factory = {
            newManager: newManager,
            serviceName: serviceName
        };

        return factory;

        function configureBreeze() {
            // use Web API OData to query and save
            breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);

            // convert between server-side PascalCase and client-side camelCase
            // breeze.NamingConvention.camelCase.setAsDefault();
        }

        function newManager() {
            var mgr = new breeze.EntityManager(serviceName);

            // TODO async?!
            mgr.fetchMetadata();

            return mgr;
        }
    }
})();