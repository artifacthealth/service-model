import * as url from "url";

export class Url {

    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    query: string;
    hash: string;

    constructor(address?: Url | string) {

        if(address == null) return;

        var parsed = url.parse(address.toString());

        this.protocol = parsed.protocol;
        this.hostname = parsed.hostname;
        this.port = parsed.port;
        this.pathname = Url.normalize(parsed.pathname);
        this.query = parsed.query;
        this.hash = parsed.hash;
    }

    resolve(address: Url | string): Url {

        if(!address) {
            return this;
        }

        var other: Url;
        if(typeof address === "string") {
            other = new Url(address);
        }
        else {
            other = address;
        }

        return new Url(url.resolve(this.toString() + "/", other.pathname));
    }

    equals(other: Url): boolean {

        if(!other) return false;
        return this.protocol === other.protocol
            && this.hostname === other.hostname
            && this.port === other.port
            && this.pathname === other.pathname
            && this.query === other.query
            && this.hash === other.hash;
    }

    clone(): Url {

        var clone = new Url();
        clone.protocol = this.protocol;
        clone.hostname = this.hostname;
        clone.port = this.port;
        clone.pathname = this.pathname;
        clone.query = this.query;
        clone.hash = this.hash;
        return clone;
    }

    toString(): string {

        return url.format(this);
    }

    static normalize (path: string): string {

        if(!path) return "/";

        // Ensure leading slash
        if (path[0] !== "/") {
            path = "/" + path;
        }

        // Remove trailing slash
        if (path.length > 1 && path[path.length - 1] === "/") {
            path = path.substring(0, path.length - 1);
        }

        return path;
    }
}
