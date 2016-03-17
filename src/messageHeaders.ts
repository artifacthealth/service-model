/**
 * Represents a collection of headers for a [[Message]].
 */
export class MessageHeaders {

    /**
     * Object map used to hold headers.
     * @hidden
     */
    private _headers: { [name: string]: string; };

    /**
     * Constructs a MessagesHeaders object.
     * @param headers Object map of headers. *Header keys must be lowercase.*
     */
    constructor(headers?: { [name: string]: string; }) {

        this._headers = headers;
    }

    /**
     * Gets a header.
     * @param name The case insensitive name of the header.
     */
    get(name: string): string {

        if(!this._headers) return;

        return this._headers[name.toLowerCase()];
    }

    /**
     * Sets a header.
     * @param name The case insensitive name of the header.
     * @param value The value of the header.
     */
    set(name: string, value: string): void {

        if(!this._headers) {
            this._headers = {};
        }

        this._headers[name.toLowerCase()] = value;
    }

    /**
     * Returns true if the collection contains the header; otherwise, returns false.
     * @param name The case insensitive name of the header.
     */
    has(name: string): boolean {

        if(!this._headers) return false;

        return !!this._headers[name.toLowerCase()];
    }

    /**
     * Deletes a header.
     * @param name The case insensitive name of the header.
     */
    delete(name: string): void {

        if(!this._headers) return;

        delete this._headers[name.toLowerCase()];
    }

    /**
     * Merges in the messages headers, overwriting any existing headers.
     * @param headers The headers to merge
     */
    merge(headers: MessageHeaders): void {

        var obj: any = headers.toObject();
        if(obj) {
            if(!this._headers) {
                this._headers = {};
            }

            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    // skip using `this.set`, since headers are coming from a MessageHeaders object we know that all
                    // the keys will be lowercase
                    this._headers[name] = obj[name];
                }
            }
        }
    }

    /**
     * Returns the headers as an object map. Will return `undefined` if no headers have been set.
     */
    toObject(): Object {

        if(this._headers) {
            return this._headers;
        }
    }
}