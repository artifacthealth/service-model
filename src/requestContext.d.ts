import Message = require("./message");

interface RequestContext {

    message: Message;

    abort(): void;
    reply(message?: Message): void;
}

export = RequestContext;