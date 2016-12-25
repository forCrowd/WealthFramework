import { Injectable } from "@angular/core";

import { BodyOutputType, ToasterConfig, ToasterService } from "angular2-toaster";

@Injectable()
export class Logger {

    constructor(private toasterService: ToasterService) {
    }

    getToasterConfig(): ToasterConfig {
        return new ToasterConfig({
            bodyOutputType: BodyOutputType.TrustedHtml,
            positionClass: "toast-bottom-right"
        });
    }

    log(message: string, data?: Object, showToast?: boolean) {
        return this.logIt(message, data, showToast, "debug");
    }

    logError(message: string, data?: Object, showToast?: boolean) {
        return this.logIt(message, data, showToast, "error");
    }

    logInfo(message: string, data?: Object, showToast?: boolean) {
        return this.logIt(message, data, showToast, "info");
    }

    logSuccess(message: string, data?: Object, showToast?: boolean) {
        return this.logIt(message, data, showToast, "success");
    }

    logWarning(message: string, data?: Object, showToast?: boolean) {
        return this.logIt(message, data, showToast, "warning");
    }

    logIt(message: string, data?: Object, showToast?: boolean, toastType?: string): void {
        showToast = typeof showToast === "undefined" ? false : showToast;

        let currentDateTime = new Date().getHours() + ":" +
            new Date().getMinutes() + ":" +
            new Date().getSeconds();

        let write: Function;
        switch (toastType) {
            case "debug": write = console.debug; break;
            case "error": write = console.error; break;
            case "info": write = console.info; break;
            case "success": write = console.log; break;
            case "warning": write = console.warn; break;
            default: write = console.log; break;
        }

        if (typeof data === "undefined") {
            write("ng2", currentDateTime, message);
        } else {
            write("ng2", currentDateTime, message, { data });
        }

        if (showToast) {

            switch (toastType) {
                case "debug": this.toasterService.pop("info", "", message); break;
                case "error": this.toasterService.pop("error", "", message); break;
                case "info": this.toasterService.pop("info", "", message); break;
                case "success": this.toasterService.pop("success", "", message); break;
                case "warning": this.toasterService.pop("warning", "", message); break;
                default: this.toasterService.pop("success", "", message); break;
            }
        }
    }
}
