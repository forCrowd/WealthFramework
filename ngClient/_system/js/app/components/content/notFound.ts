//import { LoggerService } from "../../ng2/services/logger";

class NotFoundController {

    static $inject = ["logger", "$location"];

    constructor(logger: any, $location: any) {

        _init();

        /*** Implementations ***/

        function _init() {
            var url = $location.search().url;
            if (typeof url !== "undefined") {
                throw new Error("Not found: " + url);
            }
        }
    }
}

export const notFound: angular.IComponentOptions = {
    controller: NotFoundController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/content/notFound.html?v=0.65.0"
};
