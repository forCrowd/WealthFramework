/***
 * Service: logger 
 *
 * Provides semantic logging services with help of
 * Angular's $log service that writes to the console and
 * John Papa's 'toastr.js': https://github.com/CodeSeven/toastr
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .factory('logger', ['$log', logger]);

    function logger($log) {
        configureToastr();

        var factory = {
            forSource: forSource,
            log: log,
            logError: logError,
            logInfo: logInfo,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return factory;

        function configureToastr() {
            toastr.options = {
                "positionClass": "toast-bottom-right"
            };
        }

        function forSource(src) {
            return {
                log: function (m, d, s, t, o) { return log(m, d, src, s, t, o); },
                logError: function (m, d, s, t, o) { return logError(m, d, src, s, t, o); },
                logInfo: function (m, d, s, t, o) { return logInfo(m, d, src, s, t, o); },
                logSuccess: function (m, d, s, t, o) { return logSuccess(m, d, src, s, t, o); },
                logWarning: function (m, d, s, t, o) { return logWarning(m, d, src, s, t, o); },
            };
        }

        function log(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'debug');
        }

        function logError(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'error');
        }

        function logInfo(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'info');
        }

        function logSuccess(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'success');
        }

        function logWarning(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'warning');
        }

        function logIt(message, data, source, showToast, title, optionsOverride, toastType) {
            showToast = typeof showToast === 'undefined' ? false : showToast;
            var currentDateTime = new Date().getHours() + ':' +
                new Date().getMinutes() + ':' +
                new Date().getSeconds();
            source = source ? '[' + source + '] ' : '';
            var write;
            switch (toastType) {
                case 'debug': write = $log.debug; break;
                case 'error': write = $log.error; break;
                case 'info': write = $log.info; break;
                case 'success': write = $log.log; break;
                case 'warning': write = $log.warn; break;
            }
            write(currentDateTime, source, message, data);
            var toast = null;
            if (showToast) {
                switch (toastType) {
                    case 'debug': toast = toastr.info(message, title, optionsOverride); break;
                    case 'error': toast = toastr.error(message, title, optionsOverride); break;
                    case 'info': toast = toastr.info(message, title, optionsOverride); break;
                    case 'success': toast = toastr.success(message, title, optionsOverride); break;
                    case 'warning': toast = toastr.warning(message, title, optionsOverride); break;
                }
            }
            return toast;
        }
    }
})();