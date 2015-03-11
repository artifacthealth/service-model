/// <reference path="../common/types.d.ts" />

import Message = require("../message");
import Fault = require("../fault");

interface MessageFormatter {

    deserializeRequest(message: Message, callback: ResultCallback<any[]>): void;
    serializeReply(result: any, callback: ResultCallback<Message>): void;
    serializeFault(fault: Fault, callback: ResultCallback<Message>): void;
}

export = MessageFormatter;