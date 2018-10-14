"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var order_lines_service_1 = require("./order-lines.service");
describe('OrderLinesService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [order_lines_service_1.OrderLinesService]
        });
    });
    it('should be created', testing_1.inject([order_lines_service_1.OrderLinesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=order-lines.service.spec.js.map