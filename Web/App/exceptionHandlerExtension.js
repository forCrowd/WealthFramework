(function () {
    'use strict';

    var factoryId = 'exceptionHandlerExtension';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$delegate', '$injector', 'logger', exceptionHandlerExtension]);
        });

    function exceptionHandlerExtension($delegate, $injector, logger) {
        logger = logger.forSource(factoryId);

        var exceptionUrl = '/api/Exception/Record';

        return function (exception, cause) {

            // Call base
            $delegate(exception, cause);

            // Send the exception to the server
            var $location = $injector.get('$location');
            var $http = $injector.get('$http');

            var exceptionModel = {
                Message: exception.message,
                Cause: cause,
                Url: $location.path(),
                Stack: exception.stack
            };

            $http.post(exceptionUrl, exceptionModel);
        };
    }
})();
