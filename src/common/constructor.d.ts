/**
 * Interface for a constructor.
 */
interface Constructor<T> {

    name?: string;
    new(...args: any[]): T;
}

export = Constructor;