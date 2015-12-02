import Message = require("./message");

/**
 * Represents a request.
 */
interface RequestContext {

    /**
     * The message for the request.
     */
    message: Message;

    /**
     * Aborts the request.
     */
    abort(): void;

    /**
     * Sends a reply to the request.
     * @param message The reply message.
     */
    reply(message?: Message): void;

    /**
     * Adds an event listener to the request. The only available event is the 'close' event which is raised if the
     * connection for the request closes unexpectedly.
     * @param event The event name.
     * @param listener A function to be called on the event.
     */
    addListener(event: string, listener: Function): RequestContext;

    /**
     * Removes an event listener from the request.
     * @param event The event name.
     * @param listener The function for the listener to remove.
     */
    removeListener(event: string, listener: Function): RequestContext;
}

export = RequestContext;