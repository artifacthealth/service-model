var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HttpError = require("./httpError");
var FaultError = (function (_super) {
    __extends(FaultError, _super);
    function FaultError(detail, message, code, statusCode) {
        _super.call(this, statusCode, message);
        /**
         * The name of the error.
         */
        this.name = "FaultError";
        this.code = code;
        this.detail = detail;
    }
    /**
     * Returns true if the error is a FaultError; otherwise, returns false.
     * @param err The error.
     */
    FaultError.isFaultError = function (err) {
        // Use duck-typing
        return HttpError.isHttpError(err) && err.hasOwnProperty("code") && err.hasOwnProperty("detail");
    };
    return FaultError;
})(HttpError);
module.exports = FaultError;
