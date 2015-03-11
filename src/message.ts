import UrlUtil = require("./common/urlUtil");

class Message {

    url: string;
    status: number;
    method: string;

    body: any;

    constructor(url: string) {
        this.url = UrlUtil.normalize(url);
    }

    header(name: string, value?: any): any {
        return null;
    }
}

export = Message;