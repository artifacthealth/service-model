/**
 * Generic interface for callback that has a result.
 */
interface ResultCallback<T> {

    (err?: Error, result?: T): void;
}

export = ResultCallback;