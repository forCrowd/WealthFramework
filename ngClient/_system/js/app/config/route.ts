module Main.Config {
    'use strict';

    angular.module('main')
        .config(['$locationProvider', '$routeProvider', routeConfig]);

    angular.module('main')
        .run(['locationHistory', 'logger', '$location', '$rootScope', routeRun]);

    function routeConfig($locationProvider: any, $routeProvider: any) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { title: 'Home', templateUrl: '/_system/views/content/home.html?v=0.53.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/default.aspx', { title: 'Home', templateUrl: '/_system/views/content/home.html?v=0.53.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            // Different than other content pages, enableDisqus: false
            .when('/_system/content/notFound', { title: 'Not Found', templateUrl: '/_system/views/content/notFound.html?v=0.52.0', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })

            .when('/_system/content/allInOne', { title: 'All in One', templateUrl: '/_system/views/content/allInOne.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/basics', { title: 'Basics', templateUrl: '/_system/views/content/basics.html?v=0.53.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/home', { title: 'Home', templateUrl: '/_system/views/content/home.html?v=0.53.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/implementation', { title: 'Implementation', templateUrl: '/_system/views/content/implementation.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/introduction', { title: 'Introduction', templateUrl: '/_system/views/content/introduction.html?v=0.53.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/knowledgeIndex', { title: 'Knowledge Index', templateUrl: '/_system/views/content/knowledgeIndex.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/priorityIndex', { title: 'Priority Index', templateUrl: '/_system/views/content/priorityIndex.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/prologue', { title: 'Prologue', templateUrl: '/_system/views/content/prologue.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/reason', { title: 'Reason', templateUrl: '/_system/views/content/reason.html?v=0.58.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/totalCostIndex', { title: 'Total Cost Index', templateUrl: '/_system/views/content/totalCostIndex.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/content/contributors', { title: 'Contributors', templateUrl: '/_system/views/content/contributors.html?v=0.64.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })

            /* Account */
            .when('/_system/account', { title: 'Account', templateUrl: '/_system/views/account/account.html?v=0.55.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/accountEdit', { title: 'Account Edit', templateUrl: '/_system/views/account/accountEdit.html?v=0.55.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/addPassword', { title: 'Add Password', templateUrl: '/_system/views/account/addPassword.html?v=0.55.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/changeEmail', { title: 'Change Email', templateUrl: '/_system/views/account/changeEmail.html?v=0.55.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/changePassword', { title: 'Change Password', templateUrl: '/_system/views/account/changePassword.html?v=0.55.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/changeUserName', { title: 'Change Username', templateUrl: '/_system/views/account/changeUsername.html?v=0.55.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/confirmEmail', { title: 'Confirm Email', templateUrl: '/_system/views/account/confirmEmail.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/login', { title: 'Login', templateUrl: '/_system/views/account/login.html?v=0.58.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/register', { title: 'Register', templateUrl: '/_system/views/account/register.html?v=0.58.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/_system/account/resetPassword', { title: 'Reset Password', templateUrl: '/_system/views/account/resetPassword.html?v=0.55.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })

            /* CMRP Search */
            .when('/_system/resourcePool/search', { title: 'CMRP Search', templateUrl: '/_system/views/resourcePool/resourcePoolSearch.html?v=0.57.0', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })

            /* User */
            .when('/:userName', { title: 'Profile', templateUrl: '/_system/views/account/profile.html?v=0.57.0', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/:userName/new', { title: 'New CMRP', templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.58.0', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/:userName/:resourcePoolKey/edit', { title: 'Edit CMRP', templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.58.0', resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })
            .when('/:userName/:resourcePoolKey', { title: 'View CMRP', templateUrl: '/_system/views/resourcePool/resourcePoolView.html?v=0.57.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', 'locationHistory', 'logger', '$location', '$q', '$route', validateAccess] } })

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
                invalidUrl += (i === 0 ? '?' : '&') + key + '=' + search[key];
            }

            return '/_system/content/notFound?url=' + invalidUrl;
        }

        function validateAccess(dataContext: any, locationHistory: any, logger: any, $location: any, $q: any, $route: any) {

            logger = logger.forSource('validateAccess');

            var deferred = $q.defer();

            locationHistory.createItem($location, $route.current);

            dataContext.initializeCurrentUser()
                .then(currentUser => {
                    if ($route.current.accessType !== 'undefined') {

                        // Invalid access cases
                        if (($route.current.accessType === 'unauthenticatedRequired' && currentUser.isAuthenticated() && !currentUser.IsAnonymous) ||
                            ($route.current.accessType === 'authenticatedRequired' && !currentUser.isAuthenticated())) {
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

    function routeRun(locationHistory: any, logger: any, $location: any, $rootScope: any) {

        // Logger
        logger = logger.forSource('routeRun');

        $rootScope.$on('$routeChangeError', routeChangeError);
        $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

        // Navigate to correct page in 'Invalid access' cases
        function routeChangeError(event: any, current: any, previous: any, eventObj: any);
        function routeChangeError(event, current, previous, eventObj) {
            if (eventObj.accessType === 'unauthenticatedRequired') {
                $location.url('/');
            } else if (eventObj.accessType === 'authenticatedRequired') {
                $location.url('/_system/account/login?error=To be able to continue, please login first');
            }
        }

        function routeChangeSuccess(event: any, current: any, previous: any);
        function routeChangeSuccess(event, current, previous) {

            // View title
            $rootScope.viewTitle = typeof current.title !== 'undefined' ? current.title : '';
        }
    }
}