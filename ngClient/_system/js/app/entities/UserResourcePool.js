(function () {
    'use strict';

    var factoryId = 'UserResourcePool';
    angular.module('main')
        .factory(factoryId, ['logger', userResourcePoolFactory]);

    function userResourcePoolFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return UserResourcePool;

        function UserResourcePool() {

            var self = this;

            // Server-side
            self.UserId = 0;
            self.ResourcePoolId = 0;
            self.ResourcePoolRate = 0;
        }
    }
})();