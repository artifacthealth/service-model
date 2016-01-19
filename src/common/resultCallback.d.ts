/**
 * Generic interface for callback that has a result.
 */
export interface ResultCallback<T> {

    (err?: Error, result?: T): void;
}
