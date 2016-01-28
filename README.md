# service-model
**An object oriented web service framework inspired by Windows Communication Foundation**

Discussion here

####Feature 1
discussion 

####Feature 2
discussion 


## Installation

service-model can be installed using [npm](https://www.npmjs.com/):
 
 
```sh
$ npm install service-model --save
```

## Getting Started

For brevity, the example here is only given in TypeScript but please refer to [examples]() for a full example in plain 
JavaScript.

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

Once our service is defined, we add it to a [[DispatcherFactory]]. We then add an endpoint to the service, 
providing the name of the contract, the base address for the endpoint, and a list of endpoint behaviors.

```typescript
import { DispatcherFactory, RpcBehavior } from "service-model";

var factory = new DispatcherFactory();

factory.addService(CalculatorService)
           .addEndpoint("Calculator", "/api/calculator", [new RpcBehavior()]);
```
In this case, we add the [[RpcBehavior]] which indicates that operations on this endpoint will be available through 
RPC. Operations can also be made available through REST by adding the [[RestBehavior]] which will be described
later.


### Dispatching Requests

The previously configured factory is then used to create a [[RequestDispatcher]] which is responsible for handling
service requests. In this example we configure an [express](https://www.npmjs.com/package/express) web server
to delegate all requests with a base path of "/api" to the RequestDispatcher. 

```typescript
import * as express from "express";

var app = express();
var dispatcher = factory.createDispatcher();

app.use("/api*", (req, res) => {
    dispatcher.dispatch(new ExpressRequestContext(req, res));
});

app.listen(3000);
```

## REST Services

Service operations can be made available through a REST api by adding decorators to the service implementation methods.
Revisiting the previously defined `CalculatorService` we add the [[WebGet]] decorator to the `add` and `subtract` 
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

The WebGet decorator defines a [[UrlTemplate]] for each method which is used to choose the operation for a given URL and 
decode method parameters.

We then create the endpoint with the [[RestBehavior]] instead of the [[RpcBehavior]] previously used.

```typescript
import { DispatcherFactory, RestBehavior } from "service-model";

var factory = new DispatcherFactory();

factory.addService(CalculatorService)
           .addEndpoint("Calculator", "/api/calculator", [new RestBehavior()]);
```

The service operations are now available using HTTP GET requests:

```sh
$ curl http://localhost:3000/api/calculator/add/1/2

3

```
