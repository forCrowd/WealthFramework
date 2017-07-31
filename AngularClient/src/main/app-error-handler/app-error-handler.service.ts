import { ErrorHandler, Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { SourceMapConsumer } from "source-map";

import { AppSettings } from "../../app-settings/app-settings";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

    sourceMapCache = {};
    errorCounter = 0;
    errorLimitResetTimer: Subscription = null;
    get errorLimitReached(): boolean { return this.errorCounter > 10 };

    constructor(private http: Http) { }

    handleError(error: Error): void {

        if (AppSettings.environment === "Development") {

            console.error(error);

        } else {

            this.reportError(error);
        }
    }

    private reportError(error: Error): void {

        this.processErrorLimit();

        if (!this.errorLimitReached) {

            this.getSourceMappedStackTrace(error).subscribe((stack: string) => {

                let model = {
                    Name: error.name,
                    Message: error.message,
                    Url: window.location.href,
                    Stack: stack || ""
                };

                let errorHandlerUrl = AppSettings.serviceAppUrl + "/api/Exception/Record";

                this.http.post(errorHandlerUrl, model).subscribe();
            });
        }
    }

    // Retrieve a SourceMap object for a minified script URL
    private getMapForScript(url: any) {

        if (this.sourceMapCache[url]) {
            return this.sourceMapCache[url];
        } else {

            const observable = this.http.get(url).mergeMap((response) => {

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

    /**
     * Gets stack trace by downloading and parsing .map files
     * Original solutions: http://stackoverflow.com/questions/19420604/angularjs-stack-trace-ignoring-source-map
     * @param exception
     */
    private getSourceMappedStackTrace(error: Error) {

        if (error.stack) { // not all browsers support stack traces

            return Observable.forkJoin(

                error.stack.split(/\n/).map((stackLine: any) => {

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

    /**
     * One client can only send 10 errors per five minutes
     */
    private processErrorLimit(): void {

        if (this.errorCounter === 0) {

            // If there is, unsubscribe from previous subscription
            // TODO: Not sure whether this is necessary but to be sure / coni2k - 05 Jan. '17
            if (this.errorLimitResetTimer) {
                this.errorLimitResetTimer.unsubscribe();
            }

            this.errorLimitResetTimer = Observable.timer(5000).subscribe(() => this.errorCounter = 0);
        }

        this.errorCounter++;
    }
}
