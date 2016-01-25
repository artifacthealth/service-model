/**
 * Escapes a string for an exact match in a regular expression.
 * @param str String to escape
 * @hidden
 */
export function escape(str: string): string {

    // From http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}