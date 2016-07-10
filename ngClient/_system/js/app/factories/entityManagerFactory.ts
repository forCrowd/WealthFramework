/***
 * Service: entityManagerFactory 
 *
 * Configures BreezeJS and creates new instance(s) of the 
 * BreezeJS EntityManager for use in a 'dataContext' service
 *
 ***/
module Main.Factories {
    'use strict';

    var factoryId = 'entityManagerFactory';

    export function entityManagerFactory(breeze: any,
        Element: any,
        ElementCell: any,
        ElementField: any,
        ElementItem: any,
        logger: any,
        ResourcePool: any,
        serviceAppUrl: any) {

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

            store.registerEntityTypeCtor('User', Entities.User);
            store.registerEntityTypeCtor('UserElementCell', Entities.UserElementCell);
            store.registerEntityTypeCtor('UserElementField', Entities.UserElementField);
            store.registerEntityTypeCtor('UserResourcePool', Entities.UserResourcePool);

            return manager;
        }
    }

    entityManagerFactory.$inject = ['breeze',
        'Element',
        'ElementCell',
        'ElementField',
        'ElementItem',
        'logger',
        'ResourcePool',
        'serviceAppUrl'];

    angular.module('main').factory(factoryId, entityManagerFactory);
}