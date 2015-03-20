/**
 * Interface for a constructor.
 */
interface Constructor {

    name?: string;
    new(...args: any[]): any;
}

export = Constructor;