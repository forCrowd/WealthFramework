//import { LoggerService } from "../../../ng2/services/logger";

class ProfileController {

    static $inject = ["dataContext", "logger", "$location", "$routeParams", "$scope"];

    constructor(dataContext: any, logger: any, $location: any, $routeParams: any, $scope: any) {
        var userName = $routeParams.userName;
        var vm: any = this;
        vm.currentUser = { Id: 0 };
        vm.user = { Id: 0, UserName: "", Email: "" };

        // Events
        $scope.$on("dataContext_currentUserChanged", currentUserChanged);

        _init();

        function _init() {

            vm.currentUser = dataContext.getCurrentUser();

            // If userName equals to current user
            if (userName === vm.currentUser.UserName) {
                vm.user = vm.currentUser;
            } else {

                // If not, then check it against remote
                dataContext.getUser(userName)
                    .then(user => {

                        // Not found, navigate to 404
                        if (user === null) {
                            $location.url("/_system/content/notFound?url=" + $location.url());
                            return;
                        }

                        vm.user = user;
                    });
            }
        }

        function currentUserChanged(event: any, newUser: any);
        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }
    }
}

export const profile: angular.IComponentOptions = {
    controller: ProfileController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/account/profile/profile.html?v=0.65.0"
};
