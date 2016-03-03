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
            .when('/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/default.aspx', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            // Different than normal content, enableDisqus: false
            .when('/content/404/', { title: function () { return '404'; }, templateUrl: '/views/content/404.html?v=0.46.0', enableDisqus: false, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/content/:key/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* CMRP List + View + Edit pages */
            .when('/resourcePool', { title: function () { return 'CMRP List'; }, templateUrl: '/views/resourcePool/resourcePoolList.html?v=0.47.0', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/resourcePool/new', { title: function () { return 'New CMRP'; }, templateUrl: '/views/resourcePool/resourcePoolManage.html?v=0.43.2', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/resourcePool/:resourcePoolId/edit', { title: function () { return 'Edit CMRP'; }, templateUrl: '/views/resourcePool/resourcePoolManage.html?v=0.43.2', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/resourcePool/:resourcePoolId', { title: function () { return 'View CMRP'; }, templateUrl: '/views/resourcePool/resourcePoolView.html?v=0.43.2', enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Account */
            .when('/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/views/account/accountEdit.html?v=0.43.2', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/views/account/accountEdit.html?v=0.43.2', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/addPassword', { title: function () { return 'Add Password'; }, templateUrl: '/views/account/addPassword.html?v=0.43.2', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/changeEmail', { title: function () { return 'Change Email'; }, templateUrl: '/views/account/changeEmail.html?v=0.43.2', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/changePassword', { title: function () { return 'Change Password'; }, templateUrl: '/views/account/changePassword.html?v=0.43.2', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/confirmEmail', { title: function () { return 'Confirm Email'; }, templateUrl: '/views/account/confirmEmail.html?v=0.44', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/resetPassword', { title: function () { return 'Reset Password'; }, templateUrl: '/views/account/resetPassword.html?v=0.48.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/login', { title: function () { return 'Login'; }, templateUrl: '/views/account/login.html?v=0.44', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/account/register', { title: function () { return 'Register'; }, templateUrl: '/views/account/register.html?v=0.45', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Otherwise */
            .otherwise({ redirectTo: '/content/404' }); // TODO Is it possible to return Response.StatusCode = 404; ?

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({ enabled: true });
        }

        function getManageRouteTitle(params) {

            var entity = params.entity[0].toUpperCase() + params.entity.substring(1);

            var action = typeof params.action !== 'undefined' ?
                params.action[0].toUpperCase() + params.action.substring(1) :
                'List';

            return entity + ' ' + action;
        }

        function getContentRouteTitle(params) {

            var title = typeof params.key !== 'undefined' ?
                params.key[0] + params.key.substring(1) :
                'Home'; // Default view

            return title;
        }

        function getContentTemplateUrl(params) {

            var key = typeof params.key !== 'undefined' ?
                params.key :
                'home'; // Default view

            return '/views/content/' + key + '.html?v=0.47.1';
        }

        function validateAccess(userFactory, $route, $q, locationHistory, $location, logger) {

            logger = logger.forSource('validateAccess');

            var deferred = $q.defer();

            locationHistory.createItem($location, $route.current)
                .then(function () {
                    userFactory.getCurrentUser()
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
                $location.url(locationHistory.previousItem('unauthenticatedRequired').url());
            } else if (eventObj.accessType === 'authenticatedRequired') {
                $location.url('/account/login?error=To be able to continue, please login first');
            }
        }

        function routeChangeSuccess(event, current, previous) {

            // View title
            var viewTitle = '';
            if (typeof current.title !== 'undefined') {
                // TODO Is this correct?
                viewTitle = current.title(current.params);
            }
            $rootScope.viewTitle = viewTitle;
        }
    }
})();
