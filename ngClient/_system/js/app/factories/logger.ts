/***
 * Service: logger 
 *
 * Provides semantic logging services with help of
 * Angular's $log service that writes to the console and
 * John Papa's 'toastr.js': https://github.com/CodeSeven/toastr
 *
 ***/
module Main.Factories {
    'use strict';

    angular.module('main').factory('logger', ['$log', logger]);

    function logger($log: any) {
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

        function forSource(src: any) {
            return {
                log(m, d, s, t, o) { return log(m, d, src, s, t, o); },
                logError(m, d, s, t, o) { return logError(m, d, src, s, t, o); },
                logInfo(m, d, s, t, o) { return logInfo(m, d, src, s, t, o); },
                logSuccess(m, d, s, t, o) { return logSuccess(m, d, src, s, t, o); },
                logWarning(m, d, s, t, o) { return logWarning(m, d, src, s, t, o); },
            };
        }

        function log(message: any, data: any, source: any, showToast: any, title: any, optionsOverride: any) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'debug');
        }

        function logError(message: any, data: any, source: any, showToast: any, title: any, optionsOverride: any) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'error');
        }

        function logInfo(message: any, data: any, source: any, showToast: any, title: any, optionsOverride: any) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'info');
        }

        function logSuccess(message: any, data: any, source: any, showToast: any, title: any, optionsOverride: any) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'success');
        }

        function logWarning(message: any, data: any, source: any, showToast: any, title: any, optionsOverride: any) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'warning');
        }

        function logIt(message: any, data: any, source: any, showToast: any, title: any, optionsOverride: any, toastType: any) {
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
}