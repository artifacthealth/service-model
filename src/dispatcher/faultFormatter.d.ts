import ResultCallback = require("../common/resultCallback");
import Message = require("../message");
import FaultError = require("../faultError");

interface FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void;
}

export = FaultFormatter;