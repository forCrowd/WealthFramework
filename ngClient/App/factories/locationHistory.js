(function () {
    'use strict';

    var factoryId = 'locationHistory';
    angular.module('main')
        .factory(factoryId, ['logger', locationHistory]);

    function locationHistory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var self = {
            history: [],
            historyLimit: 10
        };

        var factory = {
            create: create,
            getHistory: getHistory,
            get: get
        };

        // Return
        return factory;

        /*** Implementations ***/

        function create(itemUrl, resourcePool, isEdit) {

            var item = new LocationItem(itemUrl, resourcePool, isEdit);
            self.history.push(item);

            // Only keep limited number of items
            if (self.history.length > self.historyLimit) {
                self.history.splice(0, self.history.length - self.historyLimit);
            }
        }

        function getHistory() {
            return self.history.slice();
        }

        function get(index) {
            return self.history[index];
        }

        function LocationItem(itemUrl, resourcePool, isEdit) {
            itemUrl = typeof itemUrl !== 'undefined' ? itemUrl : '';
            resourcePool = typeof resourcePool !== 'undefined' ? resourcePool : null;
            isEdit = typeof isEdit !== 'undefined' ? isEdit : false;

            var self = this;
            self._itemUrl = itemUrl;
            self._isEdit = isEdit;
            self._resourcePool = resourcePool;
            self.url = function () {
                return self._resourcePool !== null ?
                    self._isEdit ?
                    '/resourcePool/' + self._resourcePool.Id + '/edit' :
                    '/resourcePool/' + self._resourcePool.Id :
                    self._itemUrl;
            };
        }
    }
})();