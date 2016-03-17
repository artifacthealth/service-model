/**
 * Returns a new callback that will raise an error if called more than once.
 * @param callback The original callback
 * @hidden
 */
export function onlyOnce<T>(callback: Callback): Callback {
    var called = false;
    return (err?: Error) => {
        if (called) throw new Error("Callback was already called.");
        called = true;
        callback(err);
    }
}

/**
 * Interface for callback that does not have a result.
 */
export interface Callback {

    (err?: Error): void;
}

/**
 * Generic interface for callback that has a result.
 */
export interface ResultCallback<T> {

    (err?: Error, result?: T): void;
}
