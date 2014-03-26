
angular.module('main')

.config(function ($routeProvider) {

    var entityName = this.location.pathname.replace('/', '').replace('Ng', '');
    var entityController = entityName + 'Controller as vm';
    var entityTemplateUrl = 'ViewsNg/' + entityName + '/index.html';

    var entityListController = entityName + 'ListController as vm';
    var entityListTemplateUrl = 'ViewsNg/' + entityName + '/list2.html';

    var entityEditController = entityName + 'EditController as vm';
    var entityEditTemplateUrl = 'ViewsNg/' + entityName + '/edit2.html';

    // Routes
    $routeProvider
    .when('/', {
        controller: entityController,
        templateUrl: entityTemplateUrl
    })
    .when('/new', {
        controller: entityController,
        templateUrl: entityTemplateUrl
    })
    .when('/edit/:Id', {
        controller: entityController,
        templateUrl: entityTemplateUrl
    })
    .when('/list2', {
        controller: entityListController,
        templateUrl: entityListTemplateUrl
    })
    .when('/new2', {
        controller: entityEditController,
        templateUrl: entityEditTemplateUrl
    })
    .when('/edit2/:Id', {
        controller: entityEditController,
        templateUrl: entityEditTemplateUrl
    })
    .otherwise({
        redirectTo: '/'
    });
});
