// The contents of this file are based on source code from:
// https://github.com/strongloop/express/blob/master/lib/router/layer.js

import {parse as parseQueryString} from "querystring";
import {Url} from "./url";
import {escape} from "./common/regExpUtil";

/**
 * A template for matching urls for routing. A template describes a relative URL and uses the same format as
 */
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

    /**
     * Constructs a url template.
     * @param template The template.
     */
    constructor(template: string) {

        template = Url.normalize(template);

        if(template.indexOf("#") != -1) {
            throw new Error("Hash not supported in template.");
        }

        var queryIndex = template.indexOf("?");

        this._parsePath(queryIndex == -1 ? template : template.substring(0, queryIndex));

        if(queryIndex != -1) {
            this._parseQuery(template.substring(queryIndex + 1));
        }
    }

    /**
     * Parses the template path.
     * @param text The path to parse
     * @hidden
     */
    private _parsePath(text: string): void {

        var tokens: { value: string, parameter?: boolean}[] = [],
            i = 0,
            end: number,
            l = text.length;


        while(i < l) {
            end = text.indexOf("{", i);
            if(end == -1) end = l;
            if(i == end) {
                throw new Error("Invalid path. Parameters must be separated by a literal.")
            }
            tokens.push({ value: text.substring(i, end) });
            if (end < l) {
                i = end + 1;
                end = text.indexOf("}", i);
                if (end == -1) {
                    throw new Error("Invalid path. Unmatched '{'.");
                }
                tokens.push({ value: text.substring(i, end), parameter: true });
            }
            i = end + 1;
        }

        var expression = "^";
        for (i = 0, l = tokens.length; i < l; i++) {
            var token = tokens[i];
            if(token.parameter) {
                expression += "(.+)";
                if(!this._pathParams) {
                    this._pathParams = [];
                }
                else if (this._pathParams.indexOf(token.value) != -1) {
                    throw new Error(`Invalid path. Duplicate parameter '${token.value}'.`);
                }
                this._pathParams.push(token.value);
            }
            else {
                expression += escape(token.value);
            }
        }

        this._pattern = new RegExp(expression, "i");
    }

    /**
     * Parses the template query string
     * @param text The query string to parse
     * @hidden
     */
    private _parseQuery(text: string): void {

        var query = parseQueryString(text);
        this._queryParams = new Map();

        var seen = new Set<string>();

        for(let name in query) {
            if(query.hasOwnProperty(name)) {
                var value = query[name];

                var error: string;
                if(!value) {
                    error = "Missing value";
                }
                else if(value.length < 3 || value[0] != "{" || value[value.length-1] != "}") {
                    error = "Value must be a parameter name in the format '{name}'";
                }
                else {
                    var param = value.substring(1, value.length - 1);

                    if ((this._pathParams && this._pathParams.indexOf(param) != -1) || seen.has(param)) {
                        error = `Duplicate parameter name '${param}'`;
                    }
                }
                if(error) {
                    throw new Error(`Invalid query '${name}': ${error}.`);
                }

                // save the map between the query param and the operation param, trimming off the leading colon
                this._queryParams.set(name, param);
                seen.add(param);
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