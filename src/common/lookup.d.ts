/**
 * Generic interface for a lookup table.
 */
interface Lookup<T> {

    [key: string]: T;
}

export = Lookup;