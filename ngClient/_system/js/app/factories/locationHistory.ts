module Main.Factories {
    'use strict';

    var factoryId = 'locationHistory';

    angular.module('main').factory(factoryId, ['logger', locationHistory]);

    export function locationHistory(logger: any) {

        // Logger
        logger = logger.forSource(factoryId);

        var self = {
            history: [new LocationItem('/')],
            historyLimit: 10
        };

        var factory = {
            createItem: createItem,
            getHistory: getHistory,
            previousItem: previousItem
        };

        // Return
        return factory;

        /*** Implementations ***/

        function createItem($location: any, $routeCurrent: any) {

            var itemUrl = $location.url();
            var accessType = $routeCurrent.accessType;
            var item = new LocationItem(itemUrl, accessType);
            self.history.push(item);

            // Only keep limited number of items
            if (self.history.length > self.historyLimit) {
                self.history.splice(0, self.history.length - self.historyLimit);
            }
        }

        function getHistory() {
            return self.history.slice();
        }

        function previousItem() {
            for (var i = self.history.length - 2; i >= 0; i--) {
                return self.history[i];
            }

            return null;
        }
    }

    class LocationItem {

        itemUrl: string;
        accessType: any;

        constructor(itemUrl: any, accessType?: any) {
            this.itemUrl = typeof itemUrl !== 'undefined' ? itemUrl : '';
            this.accessType = typeof accessType !== 'undefined' ? accessType : 'undefined';
        }

        url() {
            return this.itemUrl;
        }
    }
}