[![Build Status](https://travis-ci.org/artifacthealth/service-model.svg?branch=master)](https://travis-ci.org/artifacthealth/service-model)

# service-model
**An object oriented web service framework inspired by Windows Communication Foundation**

The service-model module provides an extensible web service framework for Node. The API is inspired by the Windows 
Communication Foundation (WCF). This module focuses on the dispatching of service requests and does not handle the 
underlying transport or encoding. Therefore, service-model must be paired with a server component such as 
[Express](http://expressjs.com/) or [Restify](http://restify.com/). Also note that you'll need the appropriate 
middleware for the type of transport you are using, such as the JSON [body-parser](https://www.npmjs.com/package/body-parser).
API documentation is available [here](http://artifacthealth.github.io/service-model).

## Installation

service-model can be installed using [npm](https://www.npmjs.com/):
  
```sh
$ npm install service-model --save
```

## Getting Started

For brevity, the example here is only given in TypeScript. JavaScript examples coming soon.

### Defining a Service Contract

We define a service contract, `Calculator`, that has two operations, `add` and `subtract`. The contract is specified 
using decorators on the service implementation, `CalculatorService`. 

```typescript
import { Operation, Contract } from "service-model";

@Contract("Calculator")
export class CalculatorService {

    @Operation()
    add(x: number, y: number, callback: ResultCallback<number>): void {
    
        callback(null, x + y);
    }

    @Operation()
    subtract(x: number, y: number, callback: ResultCallback<number>): void {
    
        callback(null, x - y);
    }
}
```


### Configuring the DispatcherFactory

Once our service is defined, we add it to a [DispatcherFactory](http://artifacthealth.github.io/service-model/classes/dispatcherfactory.html). We then add an endpoint to the service, 
providing the name of the contract, the base address for the endpoint, and a list of endpoint behaviors.

```typescript
import { DispatcherFactory, RpcBehavior } from "service-model";

var factory = new DispatcherFactory();

factory.addService(CalculatorService)
           .addEndpoint("Calculator", "/api/rpc/calculator", [new RpcBehavior()]);
```

In this case, we add the [RpcBehavior](http://artifacthealth.github.io/service-model/classes/rpcbehavior.html) which indicates that operations on this endpoint will be available through 
RPC. Operations can also be made available through REST by adding the [RestBehavior](http://artifacthealth.github.io/service-model/classes/restbehavior.html) which will be described
later.


### Dispatching Requests

The previously configured factory is then used to create a [RequestDispatcher](http://artifacthealth.github.io/service-model/classes/requestdispatcher.html) which is responsible for handling
service requests. In this example we configure an [Express](https://www.npmjs.com/package/express) web server
to delegate all requests with a base path of "/api" to the RequestDispatcher. The [ExpressRequestContext](http://artifacthealth.github.io/service-model/classes/expressrequestcontext.html) comes 
packaged in the library but a [RequestContext](http://artifacthealth.github.io/service-model/interfaces/requestcontext.html) can easily be created for other server platforms. 

```typescript
import * as express from "express";
import { ExpressRequestContext } from "service-model";

var app = express();
var dispatcher = factory.createDispatcher();

app.use("/api*", (req, res) => {
    dispatcher.dispatch(new ExpressRequestContext(req, res));
});

app.listen(3000);
```


## REST Services

Service operations can be made available through a REST api by adding decorators to the service implementation methods.
Revisiting the previously defined `CalculatorService` we add the [WebGet](http://artifacthealth.github.io/service-model/globals.html#webget) decorator to the `add` and `subtract` 
methods. 

```typescript
import { Operation, Contract, WebGet } from "service-model";

@Contract("Calculator")
export class CalculatorService {

    @Operation()
    @WebGet("/add/{x}/{y}")
    add(x: number, y: number, callback: ResultCallback<number>): void {
    
        callback(null, x + y);
    }

    @Operation()
    @WebGet("/subtract/{x}/{y}")
    subtract(x: number, y: number, callback: ResultCallback<number>): void {
    
        callback(null, x - y);
    }
}
```

The WebGet decorator defines a [UrlTemplate](http://artifacthealth.github.io/service-model/classes/urltemplate.html) for each method which is used to choose the operation and decode method 
parameters.

We then create an endpoint with the [RestBehavior](http://artifacthealth.github.io/service-model/classes/restbehavior.html). The `CalculatorService` now has two endpoints, supporting both 
REST and RPC.

```typescript
import { RestBehavior } from "service-model";

factory.addService(CalculatorService)
           .addEndpoint("Calculator", "/api/rest/calculator", [new RestBehavior()]);
```

The service operations are now available using HTTP GET requests:

```sh
$ curl http://localhost:3000/api/rest/calculator/add/1/2

3
```

## License

Licensed under the Apache License 2.0. Note that Microsoft released an open source implementation of their .NET 
Framework as the [Mono Project](http://www.mono-project.com/). The components of the Mono Project that relate to this
module are licensed under the MIT X11 terms.