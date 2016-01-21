(function () {
    'use strict';

    var factoryId = 'LocationItem';
    angular.module('main')
        .factory(factoryId, ['logger', locationItemFactory]);

    function locationItemFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return LocationItem;

        /*** Implementations ***/

        function LocationItem(currentPath, resourcePool, isEdit) {
            currentPath = typeof currentPath !== 'undefined' ? currentPath : '';
            resourcePool = typeof resourcePool !== 'undefined' ? resourcePool : null;
            isEdit = typeof isEdit !== 'undefined' ? isEdit : false;

            var self = this;
            self._currentPath = currentPath;
            self._isEdit = isEdit;
            self._resourcePool = resourcePool;
            self.path = function () {
                return self._resourcePool !== null ?
                    self._isEdit ?
                    '/resourcePool/' + self._resourcePool.Id + '/edit' :
                    '/resourcePool/' + self._resourcePool.Id :
                    self._currentPath;
            };
        }
    }
})();