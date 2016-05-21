/***
 * Service: entityManagerFactory 
 *
 * Configures BreezeJS and creates new instance(s) of the 
 * BreezeJS EntityManager for use in a 'dataContext' service
 *
 ***/
(function () {
    'use strict';

    var factoryId = 'entityManagerFactory';
    angular.module('main')
        .factory(factoryId, ['breeze',
            'Element',
            'ElementCell',
            'ElementField',
            'ElementItem',
            'logger',
            'ResourcePool',
            'serviceAppUrl',
            'User',
            'UserElementCell',
            'UserElementField',
            'UserResourcePool',
            '$rootScope',
            entityManagerFactory]);

    function entityManagerFactory(breeze,
        Element,
        ElementCell,
        ElementField,
        ElementItem,
        logger,
        ResourcePool,
        serviceAppUrl,
        User,
        UserElementCell,
        UserElementField,
        UserResourcePool,
        $rootScope) {

        // Logger
        logger = logger.forSource(factoryId);

        // var serviceRoot = window.location.protocol + '//localhost:15001/';
        var serviceRoot = serviceAppUrl;
        var serviceName = serviceRoot + '/odata';
        var factory = {
            newManager: newManager,
            serviceName: serviceName
        };

        return factory;

        function newManager() {
            var manager = new breeze.EntityManager(serviceName);
            var store = manager.metadataStore;

            store.registerEntityTypeCtor('Element', Element);
            store.registerEntityTypeCtor('ElementCell', ElementCell);
            store.registerEntityTypeCtor('ElementField', ElementField);
            store.registerEntityTypeCtor('ElementItem', ElementItem);
            store.registerEntityTypeCtor('ResourcePool', ResourcePool);
            store.registerEntityTypeCtor('User', User);
            store.registerEntityTypeCtor('UserElementCell', UserElementCell);
            store.registerEntityTypeCtor('UserElementField', UserElementField);
            store.registerEntityTypeCtor('UserResourcePool', UserResourcePool);

            return manager;
        }
    }
})();