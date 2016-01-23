// The contents of this file are based on source code from:
// https://github.com/strongloop/express/blob/master/lib/router/layer.js

import {parse as parseQueryString} from "querystring";
import {Url} from "./url";

var pathToRegexp = require("path-to-regexp");

export class UrlTemplate {

    /**
     * Regular expression used to match the pathname template.
     * @hidden
     */
    private _pattern: RegExp;

    /**
     * List of parameters in the pathname.
     * @hidden
     */
    private _pathParams: string[];

    /**
     * Map of parameters in the query.
     * @hidden
     */
    private _queryParams: Map<string, string>;

    constructor(template: string) {

        var url = new Url(template);

        if(url.protocol || url.hostname || url.port || url.hash) {
            throw new Error("Only the pathname and query parts can be specified in a template.");
        }

        if(!url.pathname) {
            throw new Error("Template must specify a path");
        }


        var pathParams: any[] = [];
        this._pattern = pathToRegexp(url.pathname, pathParams);

        if(pathParams.length > 0) {
            this._pathParams = pathParams.map(x => x.name);
        }

        if(url.query) {
            var queryParams = parseQueryString(url.query);
            for(let p in queryParams) {
                if(queryParams.hasOwnProperty(p)) {
                    let operationParams = queryParams[p];
                    if(!operationParams || operationParams.length < 2 || operationParams[0] != ":") {
                        throw new Error(`Invalid query parameter '${p}'. Value must be format ':name'.`);
                    }
                    // save the map between the query param and the operation param, trimming off the leading colon
                    (this._queryParams || (this._queryParams = new Map()).set(p, operationParams.substring(1)));
                }
            }
        }
    }

    /**
     * Returns true if the url matches the template.
     * @param url The url to check.
     */
    match(url: Url): boolean {

        return this._pattern.test(url.pathname);
    }

    /**
     * Parses parameter values from the given url.
     * @param url The url to parse.
     */
    parse(url: Url): Map<string, string> {

        var m = this._pattern.exec(url.pathname);
        if(!m) return null;

        var args: Map<string, string>;

        // Pull any parameters out of the path
        if(this._pathParams) {
            for (var i = 1; i < m.length; i++) {

                var key = this._pathParams[i - 1];
                var value = this._decodeParam(m[i]);
                if (value !== undefined) {
                    (args || (args = new Map())).set(key, value);
                }
            }
        }

        // Look for optional query parameters
        if(this._queryParams && url.query) {
            var queryParams = parseQueryString(url.query);
            for (var p in queryParams) {
                if (queryParams.hasOwnProperty(p)) {
                    var key = this._queryParams.get(p);
                    if(key) {
                        (args || (args = new Map())).set(key, queryParams[p]);
                    }
                }
            }
        }

        return args;
    }

    /**
     * Decodes a parameter value from the pathname.
     * @param val
     * @hidden
     */
    private _decodeParam(val: string): string {

        if (typeof val !== 'string' || val.length === 0) {
            return null;
        }

        try {
            return decodeURIComponent(val);
        } catch (err) {
            if (err instanceof URIError) {
                return undefined;
            }

            throw err;
        }
    }
}

export interface UrlArguments {

    args: Map<string, string>;
    errors: string[];
}