(function () {
    'use strict';

    var factoryId = 'exceptionHandlerExtension';
    angular.module('main')
        .config(['$provide', extendHandler]);

    function extendHandler($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$injector', 'serviceAppUrl', 'logger', exceptionHandlerExtension]);
    }

    function exceptionHandlerExtension($delegate, $injector, serviceAppUrl, logger) {
        logger = logger.forSource(factoryId);

        var exceptionUrl = serviceAppUrl + '/api/Exception/Record';

        return function (exception, cause) {

            // Call base
            $delegate(exception, cause);

            // Send the exception to the server
            var $location = $injector.get('$location');
            var $http = $injector.get('$http');

            var exceptionModel = {
                Message: exception.message,
                Cause: cause,
                Url: $location.url(),
                Stack: exception.stack
            };

            $http.post(exceptionUrl, exceptionModel);
        };
    }
})();
