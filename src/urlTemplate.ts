// The contents of this file are based on source code from:
// https://github.com/strongloop/express/blob/master/lib/router/layer.js

import {parse as parseQueryString} from "querystring";
import {Url} from "./url";
import {escape} from "./common/regExpUtil";

/**
 * A class that represents a template for matching and parsing urls. The template describes a relative URL and can only
 * include path and query components. The path can include parameters. Only the path is used for matching (the query is
 * ignored for matching.) The query can describe optional parameters. Duplicate parameter names are not allowed.
 *
 * ### Examples
 * The following are examples of valid templates:
 *
 * ```
 * "/blog"
 * ```
 * Matches "/blog". No parameters are assigned.
 *
 * ```
 * "/blog/{blogId}"
 * ```
 * Matches "/blog/1". Assigns parameter `blogId` the value "1".
 *
 * ```
 * "/blog/{blogId}/article/{articleId}"
 * ```
 * Matches "/blog/1/article/2". Assigns parameter `blogId` the value "1" and `articleId` the value "2".
 *
 * ```
 * "/blog/{blogId}/article/{articleId}?page={pageNum}"
 * ```
 * Matches "/blog/1/article/2" and "/blog/1/article/2?page=3". Assigns parameter `blogId` the value "1" and
 * `articleId` the value "2". If "page" is include in the query then assigns parameter `pageNum` the value "3".
 *
 * ```
 * "/download/{file}.{ext}"
 * ```
 * Matches "/download/some-file.jpg". Assigns parameter `file` the value "some-file" and `ext` the value "jpg".
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
                expression += "([^/]+)";
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

        this._pattern = new RegExp(expression + "$", "i");
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
            if(query[name] !== undefined) {
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
     * @param baseAddress The base url.
     * @param candidate The url to check.
     */
    match(candidate: Url): boolean {

        if(!candidate || candidate.pathname === null) return false;

        return this._pattern.test(candidate.pathname);
    }

    /**
     * Parses parameter values from the given url and returns a map of parameter name to value.
     * @param url The url to parse.
     */
    parse(url: Url): Map<string, string> {

        var args = new Map<string, string>();

        if(url) {
            var m = this._pattern.exec(url.pathname);
            if (m) {

                // Pull any parameters out of the path
                if (this._pathParams) {
                    for (var i = 1; i < m.length; i++) {

                        var key = this._pathParams[i - 1];
                        var value = this._decodeParam(m[i]);
                        if (value !== undefined) {
                            args.set(key, value);
                        }
                    }
                }

                // Look for optional query parameters
                if (this._queryParams && url.query) {
                    var queryParams = parseQueryString(url.query);
                    for (var p in queryParams) {
                        if (queryParams[p] !== undefined) {
                            var key = this._queryParams.get(p);
                            if (key) {
                                args.set(key, queryParams[p]);
                            }
                        }
                    }
                }
            }
        }

        return args;
    }

    /**
     * Returns a new UrlTemplate prefixed with the specified base address.
     * @param address The base address.
     */
    prefix(address: Url): UrlTemplate;
    prefix(prefixTemplate: UrlTemplate): UrlTemplate;
    prefix(addressOrPrefixTemplate: any): UrlTemplate {

        if (!addressOrPrefixTemplate) return this;

        // create a new instance of UrlTemplate without calling constructor
        var ret = Object.create(UrlTemplate.prototype);

        var pattern: string;
        if (addressOrPrefixTemplate instanceof UrlTemplate) {
            pattern = UrlTemplate._getTemplatePattern(addressOrPrefixTemplate);
        }
        else {
            pattern = UrlTemplate._getAddressPattern(addressOrPrefixTemplate);
        }

        // special case for empty path
        if (this._pattern.source == "^\\/$") {
            // just use the prefix
            ret._pattern = new RegExp("^" + pattern + "$", "i");
        }
        else {
            // make sure to trim the ^ from the existing RegExp
            ret._pattern = new RegExp("^" + pattern + this._pattern.source.substring(1), "i");
        }

        // copy over other fields (UrlTemplate is immutable so this is OK)
        ret._pathParams = this._pathParams;
        ret._queryParams = this._queryParams;

        return ret;
    }

    private static _getTemplatePattern(prefixTemplate: UrlTemplate): string {

        return prefixTemplate._pattern.source.substring(1, prefixTemplate._pattern.source.length - 1);
    }

    private static _getAddressPattern(address: Url): string {

        return !address.pathname ? "" : escape(address.pathname);
    }

    /**
     * Decodes a parameter value from the pathname.
     * @param val The value to decode.
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