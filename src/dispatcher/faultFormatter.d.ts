/// <reference path="../common/types.d.ts" />

import Message = require("../message");
import FaultError = require("../faultError");

interface FaultFormatter {

    serializeFault(fault: FaultError, callback: ResultCallback<Message>): void;
}

export = FaultFormatter;