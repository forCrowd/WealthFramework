
angular.module('main')

.config(function ($routeProvider) {
    
    var entityName = this.location.pathname.replace('/', '').replace('Ng', '');
    var entityController = entityName + 'Controller';
    var entityTemplateUrl = 'ViewsNg/' + entityName + '/index.html';

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
    .otherwise({
        redirectTo: '/'
    });
});
