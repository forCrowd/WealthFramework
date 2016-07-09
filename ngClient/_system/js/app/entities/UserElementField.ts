module Main.Entities {
    'use strict';

    export class UserElementField {

        // Server-side
        UserId: number;
        UserElementFieldId: number;
        Rating: number;
    }

    //var factoryId = 'UserElementField';

    //function userElementFieldFactory(logger: any) {

    //    // Logger
    //    logger = logger.forSource(factoryId);

    //    // Return
    //    return UserElementFieldX;

    //    function UserElementFieldX() {

    //        var self = this;

    //        // Server-side
    //        self.UserId = 0;
    //        self.ElementFieldId = 0;
    //        self.Rating = 0;
    //    }
    //}

    //userElementFieldFactory.$inject = ['logger'];

    //angular.module('main').factory(factoryId, userElementFieldFactory);
}