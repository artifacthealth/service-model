/**
 * Operations available for an operation.
 */
export interface OperationOptions {
    /**
     * The name of the operation. If not specified, defaults to the name of the method.
     */
    name?: string;

    /**
     * Indicates if the operation is one way. Default is false. One-way operations immediately return to the client
     * without waiting for a result.
     */
    isOneWay?: boolean;

    /**
     * Specifies the timeout for the operation. If not specified, defaults to the timeout for the service.
     */
    timeout?: number;

    /**
     * Indicates the name of the target contract for this operation. This is required when the service has more than
     * one contract.
     */
    contract?: string;
}