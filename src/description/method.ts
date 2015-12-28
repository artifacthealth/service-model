import Parameter = require ("./parameter");

class Method {

    name: string;
    parameters: Parameter[];
    returnType: Object;

    constructor(name: string) {
        this.name = name;
    }

    invoke(obj: any, args?: any[]): any {

        if(!this.name) {
            throw new Error("Method must have a name.");
        }

        this.invoke = <any>(new Function("o, a", "var m = o['" + this.name + "']; if(!m) throw new Error(\"Cannot invoke method '" + this.name + "'.\"); return m.apply(o, a)"));
        var method = obj[this.name];
        if(!method) {
            throw new Error("Cannot invoke method '" + this.name + "'.");
        }
        return method.apply(obj, args);
    }
}

export = Method;