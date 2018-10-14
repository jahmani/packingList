"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var orders_data_service_1 = require("./orders-data.service");
describe('OrdersDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [orders_data_service_1.OrdersDataService]
        });
    });
    it('should be created', testing_1.inject([orders_data_service_1.OrdersDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=orders-data.service.spec.js.map