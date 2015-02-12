(function () {
    'use strict';

    angular.module('main')
        .config(routeConfig);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { templateUrl: getContentTemplateUrl })
            .when('/content/:key/', { templateUrl: getContentTemplateUrl })

            /* Account */
            .when('/account/register', { templateUrl: '/App/views/account/register.html', controller: 'registerController as vm' })
            .when('/account/login', { templateUrl: '/App/views/account/login.html', controller: 'loginController as vm' })
            .when('/account/accountEdit', { templateUrl: '/App/views/account/accountEdit.html', controller: 'accountEditController as vm' })
            .when('/account/changePassword', { templateUrl: '/App/views/account/changePassword.html', controller: 'changePasswordController as vm' })

            /* Custom List + Edit pages */
            .when('/manage/custom/resourcePool', { templateUrl: '/App/views/manage/resourcePool/resourcePoolCustomList.html' })
            .when('/manage/custom/resourcePool/:Id', { templateUrl: '/App/views/manage/resourcePool/resourcePoolCustomView.html' })

            /* Default List + Edit pages */
            .when('/manage/:entity', { templateUrl: getManageTemplateUrl })
            .when('/manage/:entity/:action', { templateUrl: getManageTemplateUrl })
            .when('/manage/:entity/:action/:Id', { templateUrl: getManageTemplateUrl })

            .otherwise({ redirectTo: '/' });

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode(true);
        }

        function getManageTemplateUrl(params) {

            var templateUrl = '';
            var action = 'list';

            if (typeof params.action !== 'undefined')
                action = params.action;

            if (action === 'list')
                templateUrl = '/App/views/manage/list/' + params.entity + 'List.html';

            if (action === 'new' || action === 'edit')
                templateUrl = '/App/views/manage/edit/' + params.entity + 'Edit.html';

            return templateUrl;
        }

        function getContentTemplateUrl(params) {

            var key = 'home';

            if (typeof params.key !== 'undefined')
                key = params.key;

            return '/App/views/content/' + key + '.html';
        }
    }
})();
