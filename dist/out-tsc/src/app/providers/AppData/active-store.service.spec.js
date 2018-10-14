"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var active_store_service_1 = require("./active-store.service");
describe('ActiveStoreService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [active_store_service_1.ActiveStoreService]
        });
    });
    it('should be created', testing_1.inject([active_store_service_1.ActiveStoreService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=active-store.service.spec.js.map