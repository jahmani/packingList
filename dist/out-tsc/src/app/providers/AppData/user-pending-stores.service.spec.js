"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var user_pending_stores_service_1 = require("./user-pending-stores.service");
describe('UserPendingStoresService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [user_pending_stores_service_1.UserPendingStoresService]
        });
    });
    it('should be created', testing_1.inject([user_pending_stores_service_1.UserPendingStoresService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=user-pending-stores.service.spec.js.map