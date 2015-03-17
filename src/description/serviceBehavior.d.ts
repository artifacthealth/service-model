import ServiceDescription = require("./serviceDescription");
import DispatchService = require("../dispatcher/dispatchService");

interface ServiceBehavior {

    applyServiceBehavior (description: ServiceDescription, service: DispatchService): void;
}

export = ServiceBehavior;