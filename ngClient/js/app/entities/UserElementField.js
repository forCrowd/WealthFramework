(function () {
    'use strict';

    var factoryId = 'UserElementField';
    angular.module('main')
        .factory(factoryId, ['logger', userElementFieldFactory]);

    function userElementFieldFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return UserElementField;

        function UserElementField() {

            var self = this;

            // Server-side
            self.UserId = 0;
            self.ElementFieldId = 0;
            self.Rating = 0;

            // Local variables
            self.isEditing = false;
        }
    }
})();