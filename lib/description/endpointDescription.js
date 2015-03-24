var Url = require("../url");
var EndpointDescription = (function () {
    function EndpointDescription(contract, address) {
        this.behaviors = [];
        if (!contract) {
            throw new Error("Missing required argument 'contract'.");
        }
        if (!address) {
            throw new Error("Missing required argument 'address'.");
        }
        this.address = new Url(address);
        this.contract = contract;
    }
    return EndpointDescription;
})();
module.exports = EndpointDescription;
