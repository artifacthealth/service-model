/**
 * The contents of this file are based on source code from
 * https://github.com/trentm/node-bunyan.
 *
 * Copyright (c) 2011-2012 Joyent Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { LoggerOptions } from "./loggerOptions";

/**
 * A logger that conforms for the [bunyan](https://www.npmjs.com/package/bunyan) logger interface.
 */
export interface Logger {
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
