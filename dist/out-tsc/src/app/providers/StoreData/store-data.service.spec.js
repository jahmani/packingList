"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_data_service_1 = require("./store-data.service");
describe('StoreDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [store_data_service_1.StoreDataService]
        });
    });
    it('should be created', testing_1.inject([store_data_service_1.StoreDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=store-data.service.spec.js.map