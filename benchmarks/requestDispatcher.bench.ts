/// <reference path="../typings/baseline.d.ts" />
/// <reference path="../typings/tsreflect.d.ts" />

import reflect = require("tsreflect");
import RequestDispatcher = require("../src/dispatcher/requestDispatcher");
import ServiceDescription = require("../src/description/serviceDescription");

suite("RequestDispatcher", () => {

    var dispatcher = new RequestDispatcher();

    var service = new ServiceDescription(reflect.require("../tests/fixtures/calculatorService"), "/services/calculator-service/");
    service.addServiceEndpoint("Calculator");

    test("dispatch", (done) => {


    });
});