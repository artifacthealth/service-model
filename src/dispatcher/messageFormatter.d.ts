import ResultCallback = require("../common/resultCallback");
import Message = require("../message");
import FaultError = require("../faultError");

interface MessageFormatter {

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void;
    serializeReply(result: any, callback: ResultCallback<Message>): void;
}

export = MessageFormatter;