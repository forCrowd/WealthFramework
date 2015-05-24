(function () {
    'use strict';

    angular.module('main')
        .config(routeConfig);

    angular.module('main')
        .run(['$rootScope', '$location', 'logger', routeRun]);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { templateUrl: getContentTemplateUrl })
            .when('/main.aspx', { templateUrl: getContentTemplateUrl }) // TODO Is it possible to remove 'main.aspx'
            .when('/content/:key/', { templateUrl: getContentTemplateUrl })

            /* Account */
            .when('/account/register', { templateUrl: '/App/views/account/register.html?v=022', controller: 'registerController as vm' })
            .when('/account/login', { templateUrl: '/App/views/account/login.html?v=022', controller: 'loginController as vm' })
            .when('/account/accountEdit', { templateUrl: '/App/views/account/accountEdit.html?v=022', controller: 'accountEditController as vm' })
            .when('/account/changePassword', { templateUrl: '/App/views/account/changePassword.html?v=022', controller: 'changePasswordController as vm' })

            /* Custom List + Edit pages */
            .when('/manage/custom/resourcePool', { templateUrl: '/App/views/manage/resourcePool/resourcePoolCustomList.html?v=022' })
            .when('/manage/custom/resourcePool/:Id', { templateUrl: '/App/views/manage/resourcePool/resourcePoolCustomView.html?v=022' })

            /* Default List + Edit pages */
            .when('/manage/:entity', { templateUrl: getManageTemplateUrl })
            .when('/manage/:entity/:action', { templateUrl: getManageTemplateUrl })
            .when('/manage/:entity/:action/:Id', { templateUrl: getManageTemplateUrl })

            .otherwise({ redirectTo: '/content/404' }); // TODO Is it possible to return Response.StatusCode = 404; ?

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({ enabled: true });
        }

        function getManageTemplateUrl(params) {

            var templateUrl = '';
            var action = 'list';

            if (typeof params.action !== 'undefined')
                action = params.action;

            if (action === 'list')
                templateUrl = '/App/views/manage/list/' + params.entity + 'List.html?v=0224';

            if (action === 'new' || action === 'edit')
                templateUrl = '/App/views/manage/edit/' + params.entity + 'Edit.html?v=0224';

            return templateUrl;
        }

        function getContentTemplateUrl(params) {

            var key = 'home'; // Default view

            if (typeof params.key !== 'undefined')
                key = params.key;

            return '/App/views/content/' + key + '.html?v=0223';
        }
    }

    function routeRun($rootScope, $location, logger) {

        // Logger
        logger = logger.forSource('routeRun');

        // Default location
        $rootScope.locationHistory = ['/'];

        // Add each location to the history
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            $rootScope.locationHistory.push($location.path());

            // Only keep limited number of items
            var locationHistoryLimit = 20;
            if ($rootScope.locationHistory.length > locationHistoryLimit) {
                $rootScope.locationHistory.splice(0, $rootScope.locationHistory.length - locationHistoryLimit);
            }
        });
    }
})();
