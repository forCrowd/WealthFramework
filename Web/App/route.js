(function () {
    'use strict';

    angular.module('main')
        .config(routeConfig);

    angular.module('main')
        .run(['userService', '$rootScope', '$location', 'logger', routeRun]);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })
            .when('/main.aspx', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl }) // TODO Is it possible to remove 'main.aspx'
            .when('/content/:key/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })

            /* Account */
            .when('/account/register', { title: function () { return 'Register'; }, templateUrl: '/App/views/account/register.html?v=0.28', controller: 'registerController as vm' })
            .when('/account/login', { title: function () { return 'Login'; }, templateUrl: '/App/views/account/login.html?v=0.22', controller: 'loginController as vm' })
            .when('/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/App/views/account/accountEdit.html?v=0.22', controller: 'accountEditController as vm' })
            .when('/account/changePassword', { title: function () { return 'Change Password'; }, templateUrl: '/App/views/account/changePassword.html?v=0.22', controller: 'changePasswordController as vm' })

            /* Custom List + Edit pages */
            .when('/manage/custom/resourcePool', { title: function () { return 'CMRP List'; }, templateUrl: '/App/views/manage/resourcePool/resourcePoolCustomList.html?v=0.22' })
            .when('/manage/custom/resourcePool/:Id', { title: function () { return ''; }, templateUrl: '/App/views/manage/resourcePool/resourcePoolCustomView.html?v=0.22' })

            /* Default List + Edit pages */
            .when('/manage/:entity', { title: getManageRouteTitle, templateUrl: getManageRouteTemplateUrl })
            .when('/manage/:entity/:action', { title: getManageRouteTitle, templateUrl: getManageRouteTemplateUrl })
            .when('/manage/:entity/:action/:Id', { title: getManageRouteTitle, templateUrl: getManageRouteTemplateUrl })

            .otherwise({ redirectTo: '/content/404' }); // TODO Is it possible to return Response.StatusCode = 404; ?

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({ enabled: true });
        }

        function getManageRouteTitle(params) {

            var entity = params.entity[0].toUpperCase() + params.entity.substring(1);

            var action = typeof params.action !== 'undefined'
                ? action[0].toUpperCase() + action.substring(1)
                : 'List';

            return entity + ' ' + action;
        }

        function getManageRouteTemplateUrl(params) {

            var templateUrl = '';

            var action = typeof params.action !== 'undefined'
                ? params.actions
                : 'list'; // Default action

            if (action === 'list')
                templateUrl = '/App/views/manage/list/' + params.entity + 'List.html?v=0.36';

            if (action === 'new' || action === 'edit')
                templateUrl = '/App/views/manage/edit/' + params.entity + 'Edit.html?v=0.36';

            return templateUrl;
        }

        function getContentRouteTitle(params) {

            var title = typeof params.key !== 'undefined'
                ? params.key[0] + params.key.substring(1)
                : 'Home'; // Default view

            return title;
        }

        function getContentTemplateUrl(params) {

            var key = typeof params.key !== 'undefined'
                ? params.key
                : 'home'; // Default view

            return '/App/views/content/' + key + '.html?v=0.36.1';
        }
    }

    function routeRun(userService, $rootScope, $location, logger) {

        // Logger
        logger = logger.forSource('routeRun');

        // Default location
        $rootScope.locationHistory = ['/'];

        $rootScope.$on('$routeChangeStart', function (event, next, current) {

            // Navigate the authenticated user to home page, in case they try to go login or register
            userService.isAuthenticated()
                .then(function (isAuthenticated) {
                    if (isAuthenticated && ($location.path() === '/account/login' || $location.path() === '/account/register')) {
                        $location.path('/');
                    }
                });
        });

        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {

            // View title
            var viewTitle = '';
            if (typeof next.$$route !== 'undefined' && typeof next.$$route.title !== 'undefined') {
                viewTitle = next.$$route.title(next.params);
            }
            $rootScope.viewTitle = viewTitle;

            // Add each location to the history
            $rootScope.locationHistory.push($location.path());

            // Only keep limited number of items
            var locationHistoryLimit = 20;
            if ($rootScope.locationHistory.length > locationHistoryLimit) {
                $rootScope.locationHistory.splice(0, $rootScope.locationHistory.length - locationHistoryLimit);
            }
        });
    }
})();
