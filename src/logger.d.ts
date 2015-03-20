import LoggerOptions = require("./loggerOptions");

interface Logger {
    /**
     * Creates a child logger with the given options.
     * @param options Logger options.
     */
    child(options: LoggerOptions): Logger;

    /**
     * Creates a log record with the TRACE log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    trace(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the TRACE log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    trace(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the TRACE log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    trace(msg: string, ...params: any[]): void;

    /**
     * Creates a log record with the DEBUG log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    debug(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the DEBUG log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    debug(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the DEBUG log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    debug(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the INFO log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    info(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the INFO log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    info(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the INFO log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    info(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the WARN log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    warn(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the WARN log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    warn(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the WARN log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    warn(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the ERROR log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    error(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the ERROR log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    error(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the ERROR log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    error(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the FATAL log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    fatal(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the FATAL log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    fatal(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the FATAL log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    fatal(msg: string, ...args: any[]): void;
}

export = Logger;