/**
 * Logger options.
 */
export interface LoggerOptions {

    /**
     * Dictionary of custom serializers. The key is the name of the property that is serialized and the the value
     * is a function that takes an object and returns a JSON serializable value.
     */
    serializers?: {
        [key: string]: (input: any) => any;
    }
}
