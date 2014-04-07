(function () {
    'use strict';

    angular.module('main')
        .config(function ($routeProvider) {
            var entityName = window.location.pathname.replace('/', '').replace('Ng', '');
            // var entityNameLowerCase = entityName[0].toLowerCase() + entityName.substring(1);
            var entityNameLowerCase = entityName.toLowerCase();

            var entityListController = entityNameLowerCase + 'ListController as vm';
            var entityListTemplateUrl = 'ViewsNg/list/' + entityNameLowerCase + 'List.html';

            var entityEditController = entityNameLowerCase + 'EditController as vm';
            var entityEditTemplateUrl = 'ViewsNg/edit/' + entityNameLowerCase + 'Edit.html';

            // Routes
            $routeProvider
            .when('/', {
                controller: entityListController,
                templateUrl: entityListTemplateUrl
            })
            .when('/new', {
                controller: entityEditController,
                templateUrl: entityEditTemplateUrl
            })
            .when('/edit/:Id', {
                controller: entityEditController,
                templateUrl: entityEditTemplateUrl
            })
            .otherwise({
                redirectTo: '/'
            });
        });
})();
