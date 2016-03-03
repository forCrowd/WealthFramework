(function () {
    'use strict';

    var factoryId = 'locationHistory';
    angular.module('main')
        .factory(factoryId, ['resourcePoolFactory', '$q', 'logger', locationHistory]);

    function locationHistory(resourcePoolFactory, $q, logger) {

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

            var deferred = $q.defer();

            // TODO Try to use only routeCurrent?
            var itemUrl = $location.url();
            var accessType = $routeCurrent.accessType;
            var resourcePoolId = $routeCurrent.params.resourcePoolId;
            var isEdit = $location.path().substring($location.path().lastIndexOf('/') + 1) === 'edit';

            if (typeof resourcePoolId !== 'undefined') {
                resourcePoolFactory.getResourcePool(resourcePoolId).then(createItemInternal);
            } else {
                createItemInternal();
            }

            function createItemInternal(resourcePool) {
                var item = new LocationItem(itemUrl, accessType, resourcePool, isEdit);
                self.history.push(item);

                // Only keep limited number of items
                if (self.history.length > self.historyLimit) {
                    self.history.splice(0, self.history.length - self.historyLimit);
                }

                deferred.resolve();
            }

            return deferred.promise;
        }

        function getHistory() {
            return self.history.slice();
        }

        function previousItem(excludeAccessType) {
            excludeAccessType = typeof excludeAccessType !== 'undefined' ? excludeAccessType : '';

            for (var i = self.history.length - 2; i >= 0; i--) {
                var item = self.history[i];

                if (excludeAccessType === '' || excludeAccessType !== item.accessType) {
                    return item;
                }
            }
        }

        function LocationItem(itemUrl, accessType, resourcePool, isEdit) {
            itemUrl = typeof itemUrl !== 'undefined' ? itemUrl : '';
            accessType = typeof accessType !== 'undefined' ? accessType : 'undefined';
            resourcePool = typeof resourcePool !== 'undefined' ? resourcePool : null;
            isEdit = typeof isEdit !== 'undefined' ? isEdit : false;

            var self = this;
            self.itemUrl = itemUrl;
            self.accessType = accessType;
            self.resourcePool = resourcePool;
            self.isEdit = isEdit;
            self.url = url;

            function url() {
                return self.resourcePool !== null ?
                    self.isEdit ?
                    '/_system/resourcePool/' + self.resourcePool.Id + '/edit' :
                    '/_system/resourcePool/' + self.resourcePool.Id :
                    self.itemUrl;
            }
        }
    }
})();