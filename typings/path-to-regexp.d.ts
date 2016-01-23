// Type definitions for path-to-regexp v1.0.3
// Project: https://github.com/pillarjs/path-to-regexp
// Definitions by: xica <https://github.com/xica>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "path-to-regexp" {

    function pathToRegexp(path: string, keys?: PathKeys[], options?: pathToRegexp.Options): RegExp;

    interface PathKeys {
        name: string;
        prefix: string;
        delimiter: string;
        optional: boolean;
        repeat: boolean;
    }

    module pathToRegexp {

        interface Options {
            sensitive?: boolean;
            strict?: boolean;
            end?: boolean;
        }

    }

    export = pathToRegexp;

}
