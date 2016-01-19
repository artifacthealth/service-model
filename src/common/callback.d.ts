/**
 * Interface for callback that does not have a result.
 */
export interface Callback {

    (err?: Error): void;
}
