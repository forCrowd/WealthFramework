(function () {
    'use strict';

    angular.module('main')
        .config(['$routeProvider', '$locationProvider', routeConfig]);

    angular.module('main')
        .run(['$rootScope', '$location', 'locationHistory', 'logger', routeRun]);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { title: 'Home', templateUrl: '/_system/views/content/home.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/default.aspx', { title: 'Home', templateUrl: '/_system/views/content/home.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            // Different than other content pages, enableDisqus: false
            .when('/_system/content/404', { title: '404', templateUrl: '/_system/views/content/404.html?v=0.49.0', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/allInOne', { title: 'All in One', templateUrl: '/_system/views/content/allInOne.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/basics', { title: 'Basics', templateUrl: '/_system/views/content/basics.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/home', { title: 'Home', templateUrl: '/_system/views/content/home.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/implementation', { title: 'Implementation', templateUrl: '/_system/views/content/implementation.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/introduction', { title: 'Introduction', templateUrl: '/_system/views/content/introduction.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/knowledgeIndex', { title: 'Knowledge Index', templateUrl: '/_system/views/content/knowledgeIndex.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/priorityIndex', { title: 'Priority Index', templateUrl: '/_system/views/content/priorityIndex.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/prologue', { title: 'Prologue', templateUrl: '/_system/views/content/prologue.html?v=0.51.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/reason', { title: 'Reason', templateUrl: '/_system/views/content/reason.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/totalCostIndex', { title: 'Total Cost Index', templateUrl: '/_system/views/content/totalCostIndex.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* CMRP List */
            .when('/_system/resourcePool', { title: 'CMRP List', templateUrl: '/_system/views/resourcePool/resourcePoolList.html?v=0.51.0', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Account */
            .when('/_system/account', { title: 'Account', templateUrl: '/_system/views/account/account.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/accountEdit', { title: 'Account Edit', templateUrl: '/_system/views/account/accountEdit.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/addPassword', { title: 'Add Password', templateUrl: '/_system/views/account/addPassword.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changeEmail', { title: 'Change Email', templateUrl: '/_system/views/account/changeEmail.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changePassword', { title: 'Change Password', templateUrl: '/_system/views/account/changePassword.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changeUserName', { title: 'Change Username', templateUrl: '/_system/views/account/changeUsername.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/confirmEmail', { title: 'Confirm Email', templateUrl: '/_system/views/account/confirmEmail.html?v=0.51.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/login', { title: 'Login', templateUrl: '/_system/views/account/login.html?v=0.51.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/register', { title: 'Register', templateUrl: '/_system/views/account/register.html?v=0.51.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/resetPassword', { title: 'Reset Password', templateUrl: '/_system/views/account/resetPassword.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* User */
            .when('/:userName', { title: 'Profile', templateUrl: '/_system/views/account/profile.html?v=0.51.0', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/:userName/new', { title: 'New CMRP', templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.51.0', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/:userName/:resourcePoolKey/edit', { title: 'Edit CMRP', templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.51.0', resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/:userName/:resourcePoolKey', { title: 'View CMRP', templateUrl: '/_system/views/resourcePool/resourcePoolView.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['dataContext', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Otherwise */
            .otherwise({ redirectTo: '/_system/content/404' })
        ;

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({ enabled: true });
        }

        function validateAccess(dataContext, $route, $q, locationHistory, $location, logger) {

            logger = logger.forSource('validateAccess');

            var deferred = $q.defer();

            locationHistory.createItem($location, $route.current);

            dataContext.getCurrentUser()
                .then(function (currentUser) {
                    if ($route.current.accessType !== 'undefined') {

                        // Invalid access cases
                        if (($route.current.accessType === 'unauthenticatedRequired' && currentUser.isAuthenticated()) ||
                            ($route.current.accessType === 'authenticatedRequired' && !currentUser.isAuthenticated())) {
                            deferred.reject({ accessType: $route.current.accessType });
                        }
                    }

                    deferred.resolve();
                })
                .catch(function () {
                    deferred.reject(); // TODO Handle?
                });

            return deferred.promise;
        }
    }

    function routeRun($rootScope, $location, locationHistory, logger) {

        // Logger
        logger = logger.forSource('routeRun');

        $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);
        $rootScope.$on('$routeChangeError', routeChangeError);

        // Navigate to correct page in 'Invalid access' cases
        function routeChangeError(event, current, previous, eventObj) {
            if (eventObj.accessType === 'unauthenticatedRequired') {
                $location.url('/');
            } else if (eventObj.accessType === 'authenticatedRequired') {
                $location.url('/_system/account/login?error=To be able to continue, please login first');
            }
        }

        function routeChangeSuccess(event, current, previous) {

            // View title
            $rootScope.viewTitle = typeof current.title !== 'undefined' ? current.title : '';
        }
    }
})();
