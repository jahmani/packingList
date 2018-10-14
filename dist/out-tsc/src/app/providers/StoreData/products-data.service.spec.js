"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var products_data_service_1 = require("./products-data.service");
describe('ProductsDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [products_data_service_1.ProductsDataService]
        });
    });
    it('should be created', testing_1.inject([products_data_service_1.ProductsDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=products-data.service.spec.js.map