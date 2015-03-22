/**
 * Interface for callback that does not have a result.
 */
interface Callback {

    (err?: Error): void;
}

export = Callback;