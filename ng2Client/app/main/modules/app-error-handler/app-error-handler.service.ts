import { ErrorHandler, Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { SourceMapConsumer } from "source-map";

import { Logger } from "../../modules/logger/logger.module";
import { Settings } from "../../settings/settings";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

    sourceMapCache = {};
    errorCounter = 0;
    errorHandlerUrl: string = "";
    errorLimitResetTimer: any = null;
    get errorLimitReached(): boolean { return this.errorCounter > 10 };

    constructor(private http: Http, private logger: Logger) {
        this.errorHandlerUrl = Settings.serviceAppUrl + "/api/Exception/Record";
    }

    /**
     * Handles only "not found" cases
     */
    handleNotFound() {
        this.handlErrorInternal({ message: "Not found", stack: "N/A" });
    }

    /**
     * Handles all errors, except "not found" cases
     * @param error
     */
    handleError(error: any) {

        // If it's already handled, ignore
        const alreadyHandled = error.alreadyHandled
            || (error.originalError && error.originalError.alreadyHandled)
            || false;

        if (alreadyHandled) {
            return;
        }

        // Display a generic error message
        this.logger.logError("Something went wrong, please try again later!", undefined, true);

        this.handlErrorInternal(error);
    }

    /**
     * One client can only send 10 errors per five minutes
     */
    private processErrorLimit(): void {

        if (this.errorCounter === 0) {

            // If there is, unsubscribe from previous subscription
            // Todo Not sure whether this is necessary but to be sure / coni2k - 05 Jan. '17
            if (this.errorLimitResetTimer) {
                this.errorLimitResetTimer.unsubscribe();
            }

            this.errorLimitResetTimer = Observable.timer(5000).subscribe(() => this.errorCounter = 0);
        }

        this.errorCounter++;
    }

    private handlErrorInternal(error: any): void {

        if (window.location.hostname === "localhost") {

            // localhost: just log it to the console
            let message = error.message + " - Stack: " + error.stack;
            this.logger.logError(message, error.message);

        } else {

            // else: Send the error to the server, except 500 cases
            if (error.status && error.status === 500) {
                return;
            }

            this.getSourceMappedStackTrace(error).subscribe((stack: string) => {

                let model = {
                    Message: error.message.toString(),
                    Url: window.location.href,
                    Stack: stack || ""
                };

                this.processErrorLimit();
                if (!this.errorLimitReached) {
                    this.http.post(this.errorHandlerUrl, model).subscribe();
                }
            });
        }
    }

    /**
     * Gets stack trace by downloading and parsing .map files
     * Original solutions: http://stackoverflow.com/questions/19420604/angularjs-stack-trace-ignoring-source-map
     * @param exception
     */
    private getSourceMappedStackTrace(exception: any) {

        if (exception.stack) { // not all browsers support stack traces

            return Observable.forkJoin(

                exception.stack.split(/\n/).map((stackLine: any) => {

                    var match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);

                    if (match) {
                        var prefix = match[1], url = match[2], line = match[3], col = match[4];

                        return this.getMapForScript(url).map((map: any) => {

                            var pos = map.originalPositionFor({
                                line: parseInt(line, 10),
                                column: parseInt(col, 10)
                            });

                            // Experimental fixes for source
                            pos.source = pos.source.substring(0, 3) === "../"
                                ? pos.source.substring(2)
                                : pos.source.charAt(0) !== "/"
                                    ? "/app/" + pos.source
                                    : pos.source;

                            var mangledName = prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
                            mangledName = (mangledName && mangledName[2]) || "";

                            return "    at "
                                + (pos.name ? pos.name : mangledName)
                                + " "
                                + window.location.origin
                                + pos.source
                                + ":"
                                + pos.line
                                + ":"
                                + pos.column;

                        }).catch((error: any): any => {
                            return stackLine;
                        });
                    } else {
                        return Observable.of(stackLine);
                    }
                })
            ).map((lines: any) => lines.join("\r\n"));
        } else {
            return Observable.of("");
        }
    }

    // Retrieve a SourceMap object for a minified script URL
    private getMapForScript(url: any) {

        if (this.sourceMapCache[url]) {
            return this.sourceMapCache[url];
        } else {

            const observable = this.http.get(url).mergeMap((response: Response) => {

                let body = response.text();
                body = body || "";

                const match = body.match(/\/\/# sourceMappingURL=([^"\s]+\.map)/);
                if (match) {

                    let path = url.match(/^(.+)\/[^/]+$/);
                    path = path && path[1];

                    return this.http.get(path + "/" + match[1])
                        .map((response: Response) => {

                            let body = response.json();
                            body = body || {};

                            return new SourceMapConsumer(body);
                        });
                } else {
                    return Observable.throw("no 'sourceMappingURL' regex match");
                }
            }).share();

            this.sourceMapCache[url] = observable;

            return observable;
        }
    }
}
