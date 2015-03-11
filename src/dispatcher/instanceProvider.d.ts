import ServiceDescription = require("../description/serviceDescription");
import Message = require("../message");

interface InstanceProvider {

    getInstance(message: Message): Object;
}

export = InstanceProvider;