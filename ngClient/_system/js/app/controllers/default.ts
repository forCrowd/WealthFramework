//import { ApplicationInfoService } from "../ng2/services/application-info";
//import { LoggerService } from "../ng2/services/logger";

export function defaultController(applicationFactory: any, dataContext: any, logger: any, settings: any, $location: any, $rootScope: any, $scope: any, $uibModal: any) {

    // View model
    var vm: any = this;
    vm.applicationInfo = null;
    vm.currentUser = {
        Email: "",
        isAuthenticated() {
            return false;
        },
        HasPassword: false
    };
    vm.currentDate = new Date();
    vm.currentUserText = currentUserText;
    vm.displayBankTransfer = false;
    vm.displayFooterIcons = false;
    vm.disqusConfig = {
        disqus_shortname: settings.disqusShortname,
        disqus_identifier: "",
        disqus_url: ""
    };
    vm.guestAccountInfoVisible = false;
    vm.logout = logout;
    vm.openGuestAccountInfo = openGuestAccountInfo;
    vm.toggleBankTransfer = toggleBankTransfer;

    // Events
    $scope.$on("dataContext_currentUserChanged", currentUserChanged);
    $scope.$on("dataContext_currentUserEmailAddressChanged", currentUserEmailAddressChanged);
    $scope.$on("guestAccountCreated", guestAccountCreated);
    $scope.$on("$locationChangeStart", locationChangeStart);
    $scope.$on("$routeChangeSuccess", routeChangeSuccess);

    _init();

    /*** Implementations ***/

    function _init() {
        getApplicationInfo();
    }

    function currentUserChanged(event: any, newUser: any);
    function currentUserChanged(event, newUser) {
        vm.currentUser = newUser;
        vm.guestAccountInfoVisible = newUser.isAuthenticated() && newUser.IsAnonymous;
    }

    function currentUserText() {
        var userText = vm.currentUser.UserName;

        if (vm.currentUser.IsAnonymous) {
            userText += " (Guest)";
        }

        return userText;
    }

    function currentUserEmailAddressChanged() {
        vm.guestAccountInfoVisible = false;
    }

    function getApplicationInfo() {
        applicationFactory.getApplicationInfo()
            .then(applicationInfo => {
                vm.applicationInfo = applicationInfo;
            });
    }

    function guestAccountCreated() {
        vm.guestAccountInfoVisible = true;
    }

    function logout() {
        dataContext.logout()
            .then(() => {
                $location.url("/");
            });
    }

    function locationChangeStart(event: any, newUrl: any, oldUrl: any) {

        if (dataContext.hasChanges()) {

            var modalInstance = $uibModal.open({
                controller: ["$scope", "$uibModalInstance",

                    function ($scope, $uibModalInstance) {
                        var vm: any = this;
                        vm.cancel = cancel;
                        vm.leave = leave;

                        function cancel() {
                            $uibModalInstance.dismiss("cancel");
                        }

                        function leave() {
                            $uibModalInstance.close();
                        }
                    }
                ],
                controllerAs: "vm",
                templateUrl: "/_system/views/account/confirmNavigateAway.html?v=0.65.0"
            });

            modalInstance.result.then(() => {

                // User choose to cancel the changes & navigate away
                dataContext.rejectChanges();
                $location.path(newUrl.substring($location.absUrl().length - $location.url().length));

            },
                () => { });

            // Always cancel route changes
            event.preventDefault();
            return;
        }
    }

    function openGuestAccountInfo() {

        var modalInstance = $uibModal.open({
            controller: ["$scope", "$uibModalInstance",

                function ($scope, $uibModalInstance) {
                    var vm: any = this;
                    vm.close = closeModal;

                    $scope.$on("dataContext_currentUserChanged", closeModal);

                    function closeModal() {
                        $uibModalInstance.close();
                    }
                }
            ],
            controllerAs: "vm",
            templateUrl: "/_system/views/account/guestAccountInfo.html?v=0.65.0"
        });

        modalInstance.result.then(() => { },
            () => { });
    }

    function routeChangeSuccess(event: any, current: any, previous: any) {

        // Footer icons
        vm.displayFooterIcons = $location.path() === "/";

        // Load related disqus
        if (typeof current.enableDisqus !== "undefined" &&
            current.enableDisqus &&
            vm.disqusConfig.disqus_shortname !== "") {
            vm.disqusConfig.disqus_identifier = vm.disqusConfig.disqus_shortname +
                $location.path().replace(/\//g, "_");
            vm.disqusConfig.disqus_url = $location.absUrl()
                .substring(0, $location.absUrl().length - $location.url().length + $location.path().length);
        } else {
            vm.disqusConfig.disqus_identifier = "";
        }
    }

    function toggleBankTransfer() {
        vm.displayBankTransfer = !vm.displayBankTransfer;
    }
}
