import Message = require("../message");

interface MessageFilter {

    match(message: Message): boolean;
}

export = MessageFilter