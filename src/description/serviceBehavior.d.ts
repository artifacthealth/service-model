import ServiceDescription = require("./serviceDescription");
import DispatchService = require("../dispatcher/dispatchService");

interface ServiceBehavior {

    applyBehavior (description: ServiceDescription, service: DispatchService): void;
}

export = ServiceBehavior;