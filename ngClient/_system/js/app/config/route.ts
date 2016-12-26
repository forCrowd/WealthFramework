//import { LoggerService } from "../ng2/services/logger";

export function routeConfig($locationProvider: any, $routeProvider: any) {

    // Routes
    $routeProvider

        /* Content */
        .when("/", { title: "Home", template: "<home></home>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/default.aspx", { title: "Home", template: "<home></home>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        // Different than other content pages, enableDisqus: false
        .when("/_system/content/notFound", { title: "Not Found", template: "<not-found></not-found>", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })

        .when("/_system/content/allInOne", { title: "All in One", template: "<all-in-one></all-in-one>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/basics", { title: "Basics", template: "<basics></basics>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/home", { title: "Home", template: "<home></home>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/implementation", { title: "Implementation", template: "<implementation></implementation>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/introduction", { title: "Introduction", template: "<introduction></introduction>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/knowledgeIndex", { title: "Knowledge Index", template: "<knowledge-index></knowledge-index>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/priorityIndex", { title: "Priority Index", template: "<priority-index></priority-index>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/prologue", { title: "Prologue", template: "<prologue></prologue>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/reason", { title: "Reason", template: "<reason></reason>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/totalCostIndex", { title: "Total Cost Index", template: "<total-cost-index></total-cost-index>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/content/contributors", { title: "Contributors", template: "<contributors></contributors>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })

        /* Account */
        .when("/_system/account", { title: "Account Overview", template: "<account-overview></account-overview>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/accountEdit", { title: "Account Edit", template: "<account-edit></account-edit>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/addPassword", { title: "Add Password", template: "<add-password></add-password>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/changeEmail", { title: "Change Email", template: "<change-email></change-email>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/changePassword", { title: "Change Password", template: "<change-password></change-password>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/changeUserName", { title: "Change Username", template: "<change-user-name></change-user-name>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/confirmEmail", { title: "Confirm Email", template: "<confirm-email></confirm-email>", accessType: "authenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/login", { title: "Login", template: "<login></login>", accessType: "unauthenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/register", { title: "Register", template: "<register></register>", accessType: "unauthenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/_system/account/resetPassword", { title: "Reset Password", template: "<reset-password></reset-password>", accessType: "unauthenticatedRequired", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })

        /* CMRP Search */
        .when("/_system/resourcePool/search", { title: "CMRP Search", template: "<resource-pool-search></resource-pool-search>", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })

        /* User */
        .when("/:userName", { title: "Profile", template: "<profile></profile>", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/:userName/new", { title: "New CMRP", template: "<resource-pool-manage></resource-pool-manage>", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/:userName/:resourcePoolKey/edit", { title: "Edit CMRP", template: "<resource-pool-manage></resource-pool-manage>", resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })
        .when("/:userName/:resourcePoolKey", { title: "View CMRP", template: "<resource-pool-view></resource-pool-view>", enableDisqus: true, resolve: { validateAccess: ["dataContext", "locationHistory", "logger", "$location", "$q", "$route", validateAccess] } })

        /* Otherwise */
        .otherwise({ redirectTo: getNotFound })
        ;

    // Html5Mode is on, if supported (# will not be used)
    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({ enabled: true });
    }

    function getNotFound(routeParams: any, path: any, search: any) {

        var invalidUrl = path;
        var keys = Object.keys(search);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            invalidUrl += (i === 0 ? "?" : "&") + key + "=" + search[key];
        }

        return "/_system/content/notFound?url=" + invalidUrl;
    }

    function validateAccess(dataContext: any, locationHistory: any, logger: any, $location: any, $q: any, $route: any) {

        var deferred = $q.defer();

        locationHistory.createItem($location, $route.current);

        dataContext.initializeCurrentUser()
            .then(currentUser => {
                if ($route.current.accessType !== "undefined") {

                    // Invalid access cases
                    if (($route.current.accessType === "unauthenticatedRequired" && currentUser.isAuthenticated() && !currentUser.IsAnonymous) ||
                        ($route.current.accessType === "authenticatedRequired" && !currentUser.isAuthenticated())) {
                        deferred.reject({ accessType: $route.current.accessType });
                    }
                }

                deferred.resolve();
            })
            .catch(() => {
                deferred.reject(); // TODO Handle?
            });

        return deferred.promise;
    }
}

export function routeRun(logger: any, $location: any, $rootScope: any) {

    $rootScope.$on("$routeChangeError", routeChangeError);
    $rootScope.$on("$routeChangeSuccess", routeChangeSuccess);

    // Navigate to correct page in "Invalid access" cases
    function routeChangeError(event: any, current: any, previous: any, eventObj: any);
    function routeChangeError(event, current, previous, eventObj) {
        if (eventObj.accessType === "unauthenticatedRequired") {
            $location.url("/");
        } else if (eventObj.accessType === "authenticatedRequired") {
            $location.url("/_system/account/login?error=To be able to continue, please login first");
        }
    }

    function routeChangeSuccess(event: any, current: any, previous: any);
    function routeChangeSuccess(event, current, previous) {

        // View title
        $rootScope.viewTitle = typeof current.title !== "undefined" ? current.title : "";
    }
}
