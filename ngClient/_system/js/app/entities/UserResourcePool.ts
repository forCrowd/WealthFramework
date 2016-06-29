module Main.Entities {
    'use strict';

    export class UserResourcePool {

        UserId: number;
        ResourcePoolId: number;
        ResourcePoolRate: number;
    }

    //var factoryId = 'UserResourcePool';

    //function userResourcePoolFactory(logger: any) {

    //    // Logger
    //    logger = logger.forSource(factoryId);

    //    // Return
    //    return UserResourcePoolX;

    //    function UserResourcePoolX() {

    //        var self = this;

    //        // Server-side
    //        self.UserId = 0;
    //        self.ResourcePoolId = 0;
    //        self.ResourcePoolRate = 0;            
    //    }
    //}

    //userResourcePoolFactory.$inject = ['logger'];

    //angular.module('main').factory(factoryId, userResourcePoolFactory);
}