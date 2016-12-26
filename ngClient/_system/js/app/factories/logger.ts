import * as toastr from "toastr";

export function logger($log: any) {

    configureToastr();

    var factory = {
        log: log,
        logError: logError,
        logInfo: logInfo,
        logSuccess: logSuccess,
        logWarning: logWarning
    };

    return factory;

    function configureToastr() {
        toastr.options.positionClass = "toast-bottom-right";
    }

    function log(message: any, data: any, showToast: any, title: any, optionsOverride: any) {
        return logIt(message, data, showToast, title, optionsOverride, "debug");
    }

    function logError(message: any, data: any, showToast: any, title: any, optionsOverride: any) {
        return logIt(message, data, showToast, title, optionsOverride, "error");
    }

    function logInfo(message: any, data: any, showToast: any, title: any, optionsOverride: any) {
        return logIt(message, data, showToast, title, optionsOverride, "info");
    }

    function logSuccess(message: any, data: any, showToast: any, title: any, optionsOverride: any) {
        return logIt(message, data, showToast, title, optionsOverride, "success");
    }

    function logWarning(message: any, data: any, showToast: any, title: any, optionsOverride: any) {
        return logIt(message, data, showToast, title, optionsOverride, "warning");
    }

    function logIt(message: any, data: any, showToast: any, title: any, optionsOverride: any, toastType: any) {
        showToast = typeof showToast === "undefined" ? false : showToast;
        var currentDateTime = new Date().getHours() + ":" +
            new Date().getMinutes() + ":" +
            new Date().getSeconds();

        var write;
        switch (toastType) {
            case "debug": write = $log.debug; break;
            case "error": write = $log.error; break;
            case "info": write = $log.info; break;
            case "success": write = $log.log; break;
            case "warning": write = $log.warn; break;
        }
        write(currentDateTime, message, data);
        var toast = null;
        if (showToast) {
            switch (toastType) {
                case "debug": toast = toastr.info(message, title, optionsOverride); break;
                case "error": toast = toastr.error(message, title, optionsOverride); break;
                case "info": toast = toastr.info(message, title, optionsOverride); break;
                case "success": toast = toastr.success(message, title, optionsOverride); break;
                case "warning": toast = toastr.warning(message, title, optionsOverride); break;
            }
        }
        return toast;
    }
}
