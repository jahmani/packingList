"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_info_service_1 = require("./store-info.service");
describe('StoreInfoService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [store_info_service_1.StoreInfoService]
        });
    });
    it('should be created', testing_1.inject([store_info_service_1.StoreInfoService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=store-info.service.spec.js.map