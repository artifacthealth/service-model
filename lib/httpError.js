var HttpStatusCode = require("./httpStatusCode");
var HttpError = (function () {
    function HttpError(statusCodeOrMessage, message) {
        /**
         * The name of the error.
         */
        this.name = "HttpError";
        var statusCode;
        if (arguments.length == 1) {
            if (typeof statusCodeOrMessage === "number") {
                statusCode = statusCodeOrMessage;
            }
            else {
                message = statusCodeOrMessage;
            }
        }
        if (!statusCode) {
            statusCode = 500 /* InternalServerError */;
        }
        this.message = message;
        this.statusCode = statusCode;
        Error.call(this, message);
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Returns true if the error is a HttpError; otherwise, returns false.
     * @param err The error.
     */
    HttpError.isHttpError = function (err) {
        // Use duck-typing
        return err && (err instanceof Error) && err.hasOwnProperty("statusCode");
    };
    return HttpError;
})();
// TypeScript declares Error as an Interface instead of a class so use prototypical inheritance
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
module.exports = HttpError;
