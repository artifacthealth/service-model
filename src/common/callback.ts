/**
 * Interface for callback that does not have a result.
 */
interface Callback {

    (err?: Error): void;
}

module Callback {
    /**
     * Returns a new callback that will raise an error if called more than once.
     * @param callback The original callback
     */
    export function onlyOnce<T>(callback: Callback): Callback {
        var called = false;
        return (err?: Error) => {
            if (called) throw new Error("Callback was already called.");
            called = true;
            callback(err);
        }
    }
}

export = Callback;