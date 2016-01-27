/**
 * Encapsulates binary data returned from a service.
 *
 * ### Example
 *
 * In this example, a PNG image is returned from a REST service.
 *
 * ```typescript
 *  @Operation()
 *  @WebGet("/image")
 *  getImage(callback: ResultCallback<Binary>): void {
 *
 *      fs.readFile("assets/image.png", (err, buffer) => {
 *          if(err) return callback(err);
 *
 *          callback(null, new Binary(buffer, "image/png"));
 *      });
 *  }
 * ```
 */
export class Binary {

    /**
     *
     * @param data The binary data.
     * @param contentType Mime type of the data.
     */
    constructor(public data: Buffer, public contentType: string) {

        if(!data) {
            throw new Error("Missing required argument 'data'.");
        }

        if(!contentType) {
            throw new Error("Missing required argument 'contentType'.");
        }
    }
}