export function normalize (url: string): string {

    // Ensure leading slash
    if (url[0] !== "/") {
        url = "/" + url;
    }

    // Remove trailing slash
    if (url[url.length - 1] === "/") {
        url = url.substring(0, url.length - 1);
    }

    return url;
}
