"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var order_packing_lines_service_1 = require("./order-packing-lines.service");
describe('OrderPackingLinesService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [order_packing_lines_service_1.OrderPackingLinesService]
        });
    });
    it('should be created', testing_1.inject([order_packing_lines_service_1.OrderPackingLinesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=order-packing-lines.service.spec.js.map