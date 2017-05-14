import { Injectable } from "@angular/core";
import { BodyOutputType, ToasterConfig, ToasterService } from "angular2-toaster";

@Injectable()
export class Logger {

    private toasterConfigured = false;

    constructor(private toasterService: ToasterService) { }

    getToasterConfig(): ToasterConfig {
        this.toasterConfigured = true;
        return new ToasterConfig({
            bodyOutputType: BodyOutputType.TrustedHtml,
            positionClass: "toast-bottom-right"
        });
    }

    log(message: string, showToast?: boolean, ...optionalParams: any[]) {
        return this.logIt(message, showToast, "log", ...optionalParams);
    }

    logError(message: string, showToast?: boolean, ...optionalParams: any[]) {
        return this.logIt(message, showToast, "error", ...optionalParams);
    }

    logInfo(message: string, showToast?: boolean, ...optionalParams: any[]) {
        return this.logIt(message, showToast, "info", ...optionalParams);
    }

    logSuccess(message: string, showToast?: boolean, ...optionalParams: any[]) {
        return this.logIt(message, showToast, "success", ...optionalParams);
    }

    logWarning(message: string, showToast?: boolean, ...optionalParams: any[]) {
        return this.logIt(message, showToast, "warning", ...optionalParams);
    }

    private logIt(message: string, showToast?: boolean, toastType?: string, ...optionalParams: any[]): void {
        showToast = typeof showToast === "undefined" ? true : showToast;
        toastType = typeof toastType === "undefined" ? "log" : toastType;

        let write: Function;
        switch (toastType) {
            case "error": write = console.error; break;
            case "info": write = console.info; break;
            case "log": write = console.log; break;
            case "success": write = console.log; break;
            case "warning": write = console.warn; break;
        }

        write(message, ...optionalParams);

        if (showToast && this.toasterConfigured) {
            switch (toastType) {
                case "error": this.toasterService.pop("error", "", message); break;
                case "info": this.toasterService.pop("info", "", message); break;
                case "log": this.toasterService.pop("info", "", message); break;
                case "success": this.toasterService.pop("success", "", message); break;
                case "warning": this.toasterService.pop("warning", "", message); break;
            }
        }
    }
}
