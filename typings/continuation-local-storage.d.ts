declare module "continuation-local-storage" {

    function createNamespace(name: string): Namespace;
    function destroyNamespace(name: string): void;
    function reset(): void;

    interface Namespace {

        active: Object;
        set(key: string, value: any): void;
        get(key: string): any;
        run(callback: () => void): void;
        bind(callback: () => void, context: Object): void;
        bindEmitter(emitter: Object): void;
        createContext(): Object;
    }
}