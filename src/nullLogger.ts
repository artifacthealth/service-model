import { Logger } from "./logger";
import { LoggerOptions } from './loggerOptions';

/**
 * Logger that does nothing.
 * @hidden
 */
export class NullLogger implements Logger {

    static instance: Logger = new NullLogger();

    child(options: LoggerOptions): Logger {
        return this;
    }

    trace(...args: any[]): void {
    }

    debug(...args: any[]): void {
    }

    info(...args: any[]): void {
    }

    warn(...args: any[]): void {
    }

    error(...args: any[]): void {
    }

    fatal(...args: any[]): void {
    }
}
