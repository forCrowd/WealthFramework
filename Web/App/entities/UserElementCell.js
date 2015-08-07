(function () {
    'use strict';

    var serviceId = 'UserElementCell';
    angular.module('main')
        .factory(serviceId, ['logger', userElementCellFactory]);

    function userElementCellFactory(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Properties
        Object.defineProperty(UserElementCell.prototype, 'DecimalValue', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._DecimalValue; },
            set: function (value) {
                if (value !== this.backingFields._DecimalValue) {
                    this.backingFields._DecimalValue = value;

                    if (typeof this.ElementCell !== 'undefined' && this.ElementCell !== null) {

                        this.ElementCell.setCurrentUserNumericValue();

                        if (typeof this.ElementCell.ElementItem !== 'undefined' && this.ElementCell.ElementItem !== null) {
                            this.ElementCell.ElementItem.setMultiplier();
                        }

                        this.ElementCell.setNumericValue();
                        this.ElementCell.setNumericValueMultiplied();

                    }
                }
            }
        });

        // Return
        return UserElementCell;

        /*** Implementations ***/

        function UserElementCell() {

            var self = this;

            self.backingFields = {
                _DecimalValue: null
            };
        }
    }
})();