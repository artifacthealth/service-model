var domain = require("domain");
/**
 * The operation context.
 */
var OperationContext = (function () {
    function OperationContext() {
        /**
         * Dictionary of values associated with the OperationContext. Can be used to share data between functions within
         * the context of the execution of an operation.
         */
        this.items = {};
    }
    Object.defineProperty(OperationContext, "current", {
        /**
         * Gets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
         */
        get: function () {
            return OperationContext._activeDomain().__operation_context__;
        },
        /**
         * Sets the OperationContext associated with the active domain. Throws an error if there is not an active domain.
         * @param context The current context.
         */
        set: function (context) {
            OperationContext._activeDomain().__operation_context__ = context;
        },
        enumerable: true,
        configurable: true
    });
    OperationContext._activeDomain = function () {
        var active = domain.active;
        if (!active) {
            throw new Error("There is not an active domain.");
        }
        return active;
    };
    return OperationContext;
})();
module.exports = OperationContext;
