(function () {
    'use strict';

    var factoryId = 'exceptionHandlerExtension';
    angular.module('main')
        .config(['$provide', extendHandler]);

    function extendHandler($provide) {
        $provide.decorator('$exceptionHandler', ['logger', 'serviceAppUrl', '$delegate', '$injector', '$window', exceptionHandlerExtension]);
    }

    function exceptionHandlerExtension(logger, serviceAppUrl, $delegate, $injector, $window) {
        logger = logger.forSource(factoryId);

        var exceptionUrl = serviceAppUrl + '/api/Exception/Record';

        return function (exception, cause) {

            // No need to call the base, will be logged here
            // $delegate(exception, cause);

            // Show a generic error to the user, except for 'not found'
            var $location = $injector.get('$location');
            if ($location.path().substring($location.path().lastIndexOf('/') + 1) !== 'notFound') {
                logger.logError('Something went wrong, please try again later!', null, true);
            }

            getSourceMappedStackTrace(exception)
                .then(function (sourceMappedStack) {

                    // Send the exception to the server
                    var exceptionModel = {
                        Message: exception.message,
                        Cause: cause,
                        Url: $location.url(),
                        Stack: sourceMappedStack
                    };

                    var $http = $injector.get('$http');
                    $http.post(exceptionUrl, exceptionModel);

                    // Rethrow the exception
                    setTimeout(function () {
                        throw exception;
                    });
                });
        };

        function getSourceMappedStackTrace(exception) {
            var $q = $injector.get('$q'),
                $http = $injector.get('$http'),
                SMConsumer = $window.sourceMap.SourceMapConsumer,
                cache = {};

            if (exception.stack) { // not all browsers support stack traces
                return $q.all($.map(exception.stack.split(/\n/), function (stackLine) {
                    var match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);
                    if (match) {
                        var prefix = match[1], url = match[2], line = match[3], col = match[4];

                        return getMapForScript(url).then(function (map) {

                            var pos = map.originalPositionFor({
                                line: parseInt(line, 10),
                                column: parseInt(col, 10)
                            });

                            var mangledName = prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
                            mangledName = (mangledName && mangledName[2]) || '';

                            return '    at ' + (pos.name ? pos.name : mangledName) + ' ' +
                              $window.location.origin + pos.source + ':' + pos.line + ':' +
                              pos.column;
                        }, function () {
                            return stackLine;
                        });
                    } else {
                        return $q.when(stackLine);
                    }
                })).then(function (lines) {
                    return lines.join('\n');
                });
            } else {
                return $q.when('');
            }

            // Retrieve a SourceMap object for a minified script URL
            function getMapForScript(url) {
                if (cache[url]) {
                    return cache[url];
                } else {
                    var promise = $http.get(url).then(function (response) {
                        var m = response.data.match(/\/\/# sourceMappingURL=(.+\.map)/);
                        if (m) {
                            var path = url.match(/^(.+)\/[^/]+$/);
                            path = path && path[1];
                            return $http.get(path + '/' + m[1]).then(function (response) {
                                return new SMConsumer(response.data);
                            });
                        } else {
                            return $q.reject();
                        }
                    });
                    cache[url] = promise;
                    return promise;
                }
            }
        }
    }
})();
