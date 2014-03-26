
angular.module('main')

.config(function ($routeProvider) {

    var entityName = this.location.pathname.replace('/', '').replace('Ng', '');

    var entityListController = entityName + 'ListController as vm';
    var entityListTemplateUrl = 'ViewsNg/' + entityName + '/list.html';

    var entityEditController = entityName + 'EditController as vm';
    var entityEditTemplateUrl = 'ViewsNg/' + entityName + '/edit.html';

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
