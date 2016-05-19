(function () {
    'use strict';

    var factoryId = 'locationHistory';
    angular.module('main')
        .factory(factoryId, ['logger', locationHistory]);

    function locationHistory(logger) {

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

        function createItem($location, $routeCurrent) {

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
        }

        function LocationItem(itemUrl, accessType) {
            itemUrl = typeof itemUrl !== 'undefined' ? itemUrl : '';
            accessType = typeof accessType !== 'undefined' ? accessType : 'undefined';

            var self = this;
            self.itemUrl = itemUrl;
            self.accessType = accessType;
            self.url = url;

            function url() {
                return self.itemUrl;
            }
        }
    }
})();