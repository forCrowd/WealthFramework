module Main.Entities {
    'use strict';

    export class UserElementCell {

        // Server-side
        UserId = 0;
        ElementCellId = 0;
        StringValue = null;
        BooleanValue = null;
        IntegerValue = null;
        DateTimeValue = null; 
        DecimalValue = null;
    }

    //angular.module('main').controller('x', UserElementCell);
    //angular.module('main').controller(controllerId, AccountController);

    //var factoryId = 'UserElementCell';

    //function userElementCellFactory(logger: any) {

    //    // Logger
    //    logger = logger.forSource(factoryId);

    //    // Properties
    //    Object.defineProperty(UserElementCellx.prototype, 'DecimalValue', {
    //        enumerable: true,
    //        configurable: true,
    //        get() { return this.backingFields._DecimalValue; },
    //        set(value) {
    //            if (this.backingFields._DecimalValue !== value) {
    //                this.backingFields._DecimalValue = value;
    //            }
    //        }
    //    });

    //    // Return
    //    return UserElementCellx;

    //    function UserElementCellx() {

    //        var self = this;

    //        // Server-side
    //        self.UserId = 0;
    //        self.ElementCellId = 0;
    //        self.StringValue = null;
    //        self.BooleanValue = null;
    //        self.IntegerValue = null;
    //        // 
    //        self.DateTimeValue = null;

    //        // Local variables
    //        self.backingFields = {
    //            _DecimalValue: null
    //        };
    //    }
    //}

    //// userElementCellFactory.$inject = ['logger'];

    //// angular.module('main').factory(factoryId, userElementCellFactory);
}