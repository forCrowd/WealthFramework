(function () {
    'use strict';

    var factoryId = 'UserElementCell';
    angular.module('main')
        .factory(factoryId, ['logger', userElementCellFactory]);

    function userElementCellFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Properties
        Object.defineProperty(UserElementCell.prototype, 'DecimalValue', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._DecimalValue; },
            set: function (value) {
                if (this.backingFields._DecimalValue !== value) {
                    this.backingFields._DecimalValue = value;
                }
            }
        });

        // Return
        return UserElementCell;

        function UserElementCell() {

            var self = this;

            // Server-side
            self.UserId = 0;
            self.ElementCellId = 0;
            self.StringValue = null;
            self.BooleanValue = null;
            self.IntegerValue = null;
            // 
            self.DateTimeValue = null;

            // Local variables
            self.backingFields = {
                _DecimalValue: null
            };
        }
    }
})();