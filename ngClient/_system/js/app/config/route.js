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
            .when('/_system/content/404/', { title: function () { return '404'; }, templateUrl: '/_system/views/content/404.html?v=0.49.0', enableDisqus: false, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/:key/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* CMRP List + View + Edit pages */
            .when('/_system/resourcePool', { title: function () { return 'CMRP List'; }, templateUrl: '/_system/views/resourcePool/resourcePoolList.html?v=0.49.1', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/resourcePool/new', { title: function () { return 'New CMRP'; }, templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.49.0', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/resourcePool/:resourcePoolId/edit', { title: function () { return 'Edit CMRP'; }, templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.49.0', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/resourcePool/:resourcePoolId', { title: function () { return 'View CMRP'; }, templateUrl: '/_system/views/resourcePool/resourcePoolView.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Account */
            .when('/_system/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/_system/views/account/accountEdit.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/addPassword', { title: function () { return 'Add Password'; }, templateUrl: '/_system/views/account/addPassword.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changeEmail', { title: function () { return 'Change Email'; }, templateUrl: '/_system/views/account/changeEmail.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changePassword', { title: function () { return 'Change Password'; }, templateUrl: '/_system/views/account/changePassword.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/confirmEmail', { title: function () { return 'Confirm Email'; }, templateUrl: '/_system/views/account/confirmEmail.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/login', { title: function () { return 'Login'; }, templateUrl: '/_system/views/account/login.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/register', { title: function () { return 'Register'; }, templateUrl: '/_system/views/account/register.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/resetPassword', { title: function () { return 'Reset Password'; }, templateUrl: '/_system/views/account/resetPassword.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Otherwise */
            .otherwise({ redirectTo: '/_system/content/404' }); // TODO Is it possible to return Response.StatusCode = 404; ?

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

            return '/_system/views/content/' + key + '.html?v=0.49.0';
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
                $location.url('/_system/account/login?error=To be able to continue, please login first');
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
