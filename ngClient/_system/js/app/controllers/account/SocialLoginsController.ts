module Main.Controller {
    'use strict';

    var controllerId = 'SocialLoginsController';

    export class SocialLoginsController {

        static $inject = ['locationHistory', 'logger', 'serviceAppUrl', '$location'];

        constructor(locationHistory: any, logger: any, serviceAppUrl: any, $location: any) {

            // Logger
            logger = logger.forSource(controllerId);

            var vm:any = this;
            vm.getExternalLoginUrl = getExternalLoginUrl;

            function getExternalLoginUrl(provider: any);
            function getExternalLoginUrl(provider) {
                return serviceAppUrl +
                    '/api/Account/ExternalLogin?provider=' +
                    provider +
                    '&clientReturnUrl=' +
                    getReturnUrl();
            }

            function getReturnUrl() {
                // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
                var clientReturnUrl = $location.search().clientReturnUrl;
                return typeof clientReturnUrl !== 'undefined' ? clientReturnUrl : locationHistory.previousItem().url();
            }
        }
    }

    angular.module('main').controller(controllerId, SocialLoginsController);
}