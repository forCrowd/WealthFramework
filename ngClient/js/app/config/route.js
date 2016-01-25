(function () {
    'use strict';

    angular.module('main')
        .config(['$routeProvider', '$locationProvider', routeConfig]);

    angular.module('main')
        .run(['userFactory', 'resourcePoolFactory', 'locationHistory', '$rootScope', '$location', 'logger', routeRun]);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })
            .when('/default.aspx', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })
            .when('/content/:key/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })

            /* CMRP List + View + Edit pages */
            .when('/resourcePool', { title: function () { return 'CMRP List'; }, templateUrl: '/views/resourcePool/resourcePoolList.html?v=0.43.2' })
            .when('/resourcePool/new', { title: function () { return 'New CMRP'; }, templateUrl: '/views/resourcePool/resourcePoolManage.html?v=0.43.2' })
            .when('/resourcePool/:resourcePoolId/edit', { title: function () { return 'Edit CMRP'; }, templateUrl: '/views/resourcePool/resourcePoolManage.html?v=0.43.2' })
            .when('/resourcePool/:resourcePoolId', { title: function () { return 'View CMRP'; }, templateUrl: '/views/resourcePool/resourcePoolView.html?v=0.43.2' })

            /* Account */
            .when('/account/register', { title: function () { return 'Register'; }, templateUrl: '/views/account/register.html?v=0.43.2' })
            .when('/account/login', { title: function () { return 'Login'; }, templateUrl: '/views/account/login.html?v=0.43.2' })
            .when('/account/externalLogin', { title: function () { return 'Social Logins'; }, templateUrl: '/views/account/externalLogin.html?v=0.43.2' })
            .when('/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/views/account/accountEdit.html?v=0.43.2' })
            .when('/account/changeEmail', { title: function () { return 'Change Email'; }, templateUrl: '/views/account/changeEmail.html?v=0.43.2' })
            .when('/account/changePassword', { title: function () { return 'Change Password'; }, templateUrl: '/views/account/changePassword.html?v=0.43.2' })
            .when('/account/addPassword', { title: function () { return 'Add Password'; }, templateUrl: '/views/account/addPassword.html?v=0.43.2' })
            .when('/account/confirmEmail', { title: function () { return 'Confirm Email'; }, templateUrl: '/views/account/confirmEmail.html?v=0.43.2' })

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

            return '/views/content/' + key + '.html?v=0.43.2';
        }
    }

    function routeRun(userFactory, resourcePoolFactory, locationHistory, $rootScope, $location, logger) {

        // Logger
        logger = logger.forSource('routeRun');

        // Default location
        $rootScope.$on('$routeChangeStart', function (event, next, current) {

            // Navigate the authenticated user to home page, in case they try to go login or register
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    if (currentUser.isAuthenticated() && ($location.path() === '/account/login' || $location.path() === '/account/register')) {
                        $location.url('/');
                    }
                });
        });

        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {

            // View title
            var viewTitle = '';
            if (typeof next.$$route !== 'undefined' && typeof next.$$route.title !== 'undefined') {
                // TODO Is this correct?
                viewTitle = next.$$route.title(next.params);
            }
            $rootScope.viewTitle = viewTitle;

            // Newly added resource pool fix
            if (typeof next.params.resourcePoolId !== 'undefined') {
                var resourcePoolId = next.params.resourcePoolId;
                resourcePoolFactory.getResourcePool(resourcePoolId)
                    .then(function (resourcePool) {
                        createLocationHistory(resourcePool);
                    });
            } else {
                createLocationHistory();
            }

            function createLocationHistory(resourcePool) {
                resourcePool = typeof resourcePool !== 'undefined' ? resourcePool : null;

                // Add each location to the history
                locationHistory.create($location.url(), resourcePool, $location.path().substring($location.path().lastIndexOf('/') + 1) === 'edit');
            }
        });
    }
})();
