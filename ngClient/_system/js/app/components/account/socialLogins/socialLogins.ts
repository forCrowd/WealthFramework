//import { LoggerService } from "../../../ng2/services/logger";

class SocialLoginsController {

    static $inject = ["locationHistory", "logger", "settings", "$location"];

    constructor(locationHistory: any, logger: any, settings: any, $location: any) {

        var vm: any = this;
        vm.getExternalLoginUrl = getExternalLoginUrl;

        function getExternalLoginUrl(provider: any) {
            return settings.serviceAppUrl +
                "/api/Account/ExternalLogin?provider=" +
                provider +
                "&clientReturnUrl=" +
                getReturnUrl();
        }

        function getReturnUrl() {
            // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== "undefined" ? clientReturnUrl : locationHistory.previousItem().url();
        }
    }
}

export const socialLogins: angular.IComponentOptions = {
    controller: SocialLoginsController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/socialLogins/socialLogins.html?v=0.65.0"
};
