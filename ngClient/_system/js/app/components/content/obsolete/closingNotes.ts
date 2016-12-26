//import { LoggerService } from "../../../ng2/services/logger";

module Main.Components {
    "use strict";

    var componentId = "closingNotes";

    export class ClosingNotesController {

        static $inject = ["dataContext", "logger", "$location", "$rootScope", "$scope"];

        constructor(dataContext: any, logger: any, $location: any, $rootScope: any, $scope: any) {

            // View model
            var vm:any = this;
            vm.currentUser = {
                isAuthenticated() {
                    return false;
                }
            };

            $scope.$on("dataContext_currentUserChanged", currentUserChanged);

            _init();

            /*** Implementations ***/

            function _init() {
                vm.currentUser = dataContext.getCurrentUser();
            }

            function currentUserChanged(event: any, newUser: any);
            function currentUserChanged(event, newUser) {
                vm.currentUser = newUser;
            }
        }
    }

    export const closingNotes: angular.IComponentOptions = {
        controller: ClosingNotesController,
        controllerAs: "vm",
        templateUrl: "/_system/js/app/components/content/obsolete/closingNotes.html?v=0.65.0"
    };

    //angular.module("main").component(componentId, closingNotes);
}