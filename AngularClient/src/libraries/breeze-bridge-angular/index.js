"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var breeze_client_1 = require("../breeze-client");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var BreezeBridgeAngularModule = (function () {
    function BreezeBridgeAngularModule(http) {
        this.http = http;
        // Configure Breeze for Angular ... exactly once.
        // config breeze to use the native 'backingStore' modeling adapter appropriate for Ng
        // 'backingStore' is the Breeze default but we set it here to be explicit.
        breeze_client_1.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        breeze_client_1.config.setQ(Q);
        breeze_client_1.config.registerAdapter('ajax', function () { return new AjaxAngularAdapter(http); });
        breeze_client_1.config.initializeAdapterInstance('ajax', AjaxAngularAdapter.adapterName, true);
    }
    return BreezeBridgeAngularModule;
}());
BreezeBridgeAngularModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [http_1.HttpModule]
            },] },
];
/** @nocollapse */
BreezeBridgeAngularModule.ctorParameters = function () { return [
    { type: http_1.Http, },
]; };
exports.BreezeBridgeAngularModule = BreezeBridgeAngularModule;
/**
 * Minimum for breeze breeze Q/ES6 Promise adapter
 */
var Q = {
    defer: function () {
        var resolve;
        var reject;
        var promise = new Promise(function (_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
        return {
            promise: promise,
            resolve: function (value) { resolve(value); },
            reject: function (reason) { reject(reason); }
        };
    },
    resolve: function (value) {
        var deferred = Q.defer();
        deferred.resolve(value);
        return deferred.promise;
    },
    reject: function (reason) {
        var deferred = Q.defer();
        deferred.reject(reason);
        return deferred.promise;
    }
};
////////////////////
var AjaxAngularAdapter = (function () {
    function AjaxAngularAdapter(http) {
        this.http = http;
        this.name = AjaxAngularAdapter.adapterName;
        this.defaultSettings = {};
    }
    AjaxAngularAdapter.prototype.initialize = function () { };
    AjaxAngularAdapter.prototype.ajax = function (config) {
        if (!this.http) {
            throw new Error('Unable to locate angular http module for ajax adapter');
        }
        // merge default DataSetAdapter Settings with config arg
        if (!breeze_client_1.core.isEmpty(this.defaultSettings)) {
            var compositeConfig = breeze_client_1.core.extend({}, this.defaultSettings);
            config = breeze_client_1.core.extend(compositeConfig, config);
            // extend is shallow; extend headers separately
            var headers_1 = breeze_client_1.core.extend({}, this.defaultSettings['headers']); // copy default headers 1st
            config['headers'] = breeze_client_1.core.extend(headers_1, config.headers);
        }
        if (config.crossDomain) {
            throw new Error(this.name + ' does not support JSONP (jQuery.ajax:crossDomain) requests');
        }
        var url = config.url;
        if (!breeze_client_1.core.isEmpty(config.params)) {
            // Hack: Not sure how Angular handles writing 'search' parameters to the url.
            // so this approach takes over the url param writing completely.
            var delim = (url.indexOf('?') >= 0) ? '&' : '?';
            url = url + delim + encodeParams(config.params);
        }
        var headers = new http_1.Headers(config.headers || {});
        if (!headers.has('Content-Type')) {
            if (config.type != 'GET' && config.type != 'DELETE' && config.contentType !== false) {
                headers.set('Content-Type', config.contentType || 'application/json; charset=utf-8');
            }
        }
        // Create the http request body which must be stringified
        var body = config.data;
        if (body && typeof body !== 'string') {
            body = JSON.stringify(body);
        }
        ;
        var reqOptions = new http_1.RequestOptions({
            url: url,
            method: (config.type || 'GET').toUpperCase(),
            headers: headers,
            body: body,
        });
        var request = new http_1.Request(reqOptions);
        var requestInfo = {
            adapter: this,
            requestOptions: reqOptions,
            request: request,
            dsaConfig: config,
            success: successFn,
            error: errorFn // adapter's error callback
        };
        if (breeze_client_1.core.isFunction(this.requestInterceptor)) {
            this.requestInterceptor(requestInfo);
            if (this.requestInterceptor['oneTime']) {
                this.requestInterceptor = null;
            }
        }
        if (requestInfo.request) {
            this.http.request(requestInfo.request)
                .map(extractData)
                .toPromise()
                .then(requestInfo.success)
                .catch(requestInfo.error);
        }
        function extractData(response) {
            var data;
            var dt = requestInfo.dsaConfig.dataType;
            // beware:`res.json` and `res.text` will be async some day
            if (dt && dt !== 'json') {
                data = response.text ? response.text() : null;
            }
            else {
                data = response.json ? response.json() : null;
            }
            return { data: data, response: response };
        }
        function successFn(arg) {
            if (arg.response.status < 200 || arg.response.status >= 300) {
                throw { data: arg.data, response: arg.response };
            }
            var httpResponse = {
                config: requestInfo.request,
                data: arg.data,
                getHeaders: makeGetHeaders(arg.response),
                status: arg.response.status
            };
            httpResponse['ngConfig'] = requestInfo.request;
            httpResponse['statusText'] = arg.response.statusText;
            httpResponse['response'] = arg.response;
            config.success(httpResponse);
        }
        function errorFn(arg) {
            if (arg instanceof Error) {
                throw arg; // program error; nothing we can do
            }
            else {
                var data;
                var response;
                if (arg instanceof http_1.Response) {
                    response = arg;
                    try {
                        data = arg.json();
                    }
                    catch (e) {
                        data = arg.text();
                    }
                }
                else {
                    data = arg.data;
                    response = arg.response;
                }
                // Timeout appears as an error with status===0 and no data.
                if (response.status === 0 && data == null) {
                    data = 'timeout';
                }
                var errorMessage = response.status + ": " + response.statusText;
                if (data && typeof data === 'object') {
                    data["message"] = data["message"] || errorMessage; // breeze looks at the message property
                }
                if (!data) {
                    data = errorMessage; // Return the error message as data
                }
                var httpResponse = {
                    config: requestInfo.request,
                    data: data,
                    getHeaders: makeGetHeaders(response),
                    status: response.status
                };
                httpResponse['ngConfig'] = requestInfo.request;
                httpResponse['statusText'] = response.statusText;
                httpResponse['response'] = response;
                config.error(httpResponse); // send error to breeze error handler
            }
        }
    };
    ;
    return AjaxAngularAdapter;
}());
AjaxAngularAdapter.adapterName = 'angular';
exports.AjaxAngularAdapter = AjaxAngularAdapter;
///// Helpers ////
function encodeParams(obj) {
    var query = '';
    var subValue, innerObj, fullSubName;
    for (var name_1 in obj) {
        if (!obj.hasOwnProperty(name_1)) {
            continue;
        }
        var value = obj[name_1];
        if (value instanceof Array) {
            for (var i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name_1 + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += encodeParams(innerObj) + '&';
            }
        }
        else if (value && value.toISOString) {
            query += encodeURIComponent(name_1) + '=' + encodeURIComponent(value.toISOString()) + '&';
        }
        else if (value instanceof Object) {
            for (var subName in value) {
                if (obj.hasOwnProperty(name_1)) {
                    subValue = value[subName];
                    fullSubName = name_1 + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += encodeParams(innerObj) + '&';
                }
            }
        }
        else if (value === null) {
            query += encodeURIComponent(name_1) + '=&';
        }
        else if (value !== undefined) {
            query += encodeURIComponent(name_1) + '=' + encodeURIComponent(value) + '&';
        }
    }
    return query.length ? query.substr(0, query.length - 1) : query;
}
function makeGetHeaders(res) {
    var headers = res.headers;
    return function getHeaders(headerName) { return headers.getAll(headerName).join('\r\n'); };
}
//# sourceMappingURL=breeze-bridge-angular.js.map