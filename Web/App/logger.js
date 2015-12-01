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
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return factory;

        function configureToastr() {
            toastr.options = {
                "positionClass": "toast-bottom-right"
                //,"preventDuplicates": true
            }
        }

        function forSource(src) {
            return {
                log: function (m, d, s, t, o) { log(m, d, src, s, t, o); },
                logError: function (m, d, s, t, o) { logError(m, d, src, s, t, o); },
                logSuccess: function (m, d, s, t, o) { logSuccess(m, d, src, s, t, o); },
                logWarning: function (m, d, s, t, o) { logWarning(m, d, src, s, t, o); },
            };
        }

        function log(message, data, source, showToast, title, optionsOverride) {
            logIt(message, data, source, showToast, title, optionsOverride, 'info');
        }

        function logWarning(message, data, source, showToast, title, optionsOverride) {
            logIt(message, data, source, showToast, title, optionsOverride, 'warning');
        }

        function logSuccess(message, data, source, showToast, title, optionsOverride) {
            logIt(message, data, source, showToast, title, optionsOverride, 'success');
        }

        function logError(message, data, source, showToast, title, optionsOverride) {
            logIt(message, data, source, showToast, title, optionsOverride, 'error');
        }

        function logIt(message, data, source, showToast, title, optionsOverride, toastType) {
            showToast = typeof showToast === 'undefined' ? false : showToast;
            var write = (toastType === 'error') ? $log.error : $log.log;
            source = source ? '[' + source + '] ' : '';
            write(source, message, data);
            if (showToast) {
                if (toastType === 'error') {
                    toastr.error(message, title, optionsOverride);
                } else if (toastType === 'warning') {
                    toastr.warning(message, title, optionsOverride);
                } else if (toastType === 'success') {
                    toastr.success(message, title, optionsOverride);
                } else {
                    toastr.info(message, title, optionsOverride);
                }
            }
        }
    }
})();