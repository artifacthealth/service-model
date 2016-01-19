/**
 * Interface for a constructor.
 */
export interface Constructor<T> {

    name?: string;
    new(...args: any[]): T;
}
