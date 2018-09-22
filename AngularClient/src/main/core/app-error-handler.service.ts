import { ErrorHandler, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable, of as observableOf, Subscription, timer } from "rxjs";
import { map, mergeMap, share } from "rxjs/operators";
import { SourceMapConsumer } from "../../libraries/source-map";

import { AppSettings } from "../../app-settings/app-settings";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  sourceMapCache = {};
  errorCounter = 0;
  errorLimitResetTimer: Subscription = null;
  get errorLimitReached(): boolean { return this.errorCounter > 10 };

  constructor(private readonly httpClient: HttpClient) {
  }

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

        const model = {
          Name: error.name,
          Message: error.message,
          Url: window.location.href,
          Stack: stack || ""
        };

        const errorHandlerUrl = AppSettings.serviceApiUrl + "/Exception/Record";

        this.httpClient.post(errorHandlerUrl, model).subscribe();
      });
    }
  }

  // Retrieve a SourceMap object for a minified script URL
  private getMapForScript(url: any) {

    if (this.sourceMapCache[url]) {

      return this.sourceMapCache[url];

    } else {

      const observable = this.httpClient.get(url, { responseType: "text" }).pipe(mergeMap(body => {

        const match = body.match(/\/\/# sourceMappingURL=([^"\s]+\.map)/);

        if (match) {
          const sourceMapUrl = match[1];
          return this.httpClient.get(sourceMapUrl, { responseType: "text" })
            .pipe(map((response: any) => {
              return new SourceMapConsumer(response);
            }));
        } else {
          return Observable.throw("no 'sourceMappingURL' regex match");
        }
      })).pipe(share());

      this.sourceMapCache[url] = observable;

      return observable;
    }
  }

  /**
   * Gets stack trace by downloading and parsing .map files
   * Original solutions: http://stackoverflow.com/questions/19420604/angularjs-stack-trace-ignoring-source-map
   * @param exception
   */
  private getSourceMappedStackTrace(error: Error): Observable<any> {

    if (error.stack) { // not all browsers support stack traces

      return forkJoin(
        error.stack.split(/\n/).map((stackLine: any) => {

          var match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);

          if (match) {
            var prefix = match[1];
            const url = match[2];
            var line = match[3],
              col = match[4];

            return this.getMapForScript(url).map((map: any) => {

              var pos = map.originalPositionFor({
                line: parseInt(line, 10),
                column: parseInt(col, 10)
              });

              // Experimental fixes for source
              pos.source = pos.source.substring(0, 3) === "../"
                ? pos.source.substring(2)
                : pos.source.charAt(0) !== "/"
                  ? `/${pos.source}`
                  : pos.source;

              var mangledName = prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
              mangledName = (mangledName && mangledName[2]) || "";

              return `    at ${pos.name ? pos.name : mangledName} ${window.location.origin}${pos.source}:${pos.line}:${pos.column}`;

            }).catch(() => {
              return stackLine;
            });
          } else {
            return observableOf(stackLine);
          }
        })
      ).pipe(map((lines: any) => lines.join("\r\n")));
    } else {
      return observableOf("");
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

      this.errorLimitResetTimer = timer(5000).subscribe(() => this.errorCounter = 0);
    }

    this.errorCounter++;
  }
}
