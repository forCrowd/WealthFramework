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
        .factory(serviceId, ['breeze',
            'Element',
            'ElementCell',
            'ElementField',
            'ElementItem',
            'ResourcePool',
            'UserElementCell',
            '$rootScope',
            'logger',
            entityManagerFactory]);

    function entityManagerFactory(breeze,
        Element,
        ElementCell,
        ElementField,
        ElementItem,
        ResourcePool,
        UserElementCell,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(serviceId);

        configureBreeze();

        var serviceRoot = window.location.protocol + '//' + window.location.host + '/';
        var serviceName = serviceRoot + 'odata/';
        var factory = {
            newManager: newManager,
            serviceName: serviceName
        };

        return factory;

        function configureBreeze() {

            // Use Web API OData to query and save
            var adapter = breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);
            adapter.getRoutePrefix = getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x;

            // convert between server-side PascalCase and client-side camelCase
            // breeze.NamingConvention.camelCase.setAsDefault();

            function getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x(dataService) {

                // Copied from breeze.debug and modified for Web API OData v.5.3.1.
                if (typeof document === 'object') { // browser
                    var parser = document.createElement('a');
                    parser.href = dataService.serviceName;
                } else { // node
                    parser = url.parse(dataService.serviceName);
                }

                // THE CHANGE FOR 5.3.1: Add '/' prefix to pathname
                var prefix = parser.pathname;
                if (prefix[0] !== '/') {
                    prefix = '/' + prefix;
                } // add leading '/'  (only in IE)
                if (prefix.substr(-1) !== '/') {
                    prefix += '/';
                } // ensure trailing '/'

                return prefix;
            };
        }

        function newManager() {
            var manager = new breeze.EntityManager(serviceName);
            var store = manager.metadataStore;

            store.registerEntityTypeCtor('Element', Element);
            store.registerEntityTypeCtor('ElementCell', ElementCell);
            store.registerEntityTypeCtor('ElementField', ElementField);
            store.registerEntityTypeCtor('ElementItem', ElementItem);
            store.registerEntityTypeCtor('ResourcePool', ResourcePool);
            store.registerEntityTypeCtor('UserElementCell', UserElementCell);

            return manager;
        }
    }
})();