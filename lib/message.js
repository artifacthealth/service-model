var Message = (function () {
    function Message(body) {
        this.headers = {};
        this.body = body;
    }
    Message.createReply = function (status, body) {
        var ret = new Message(body);
        ret.statusCode = status;
        return ret;
    };
    return Message;
})();
module.exports = Message;
