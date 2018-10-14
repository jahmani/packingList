"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var user_stores_service_1 = require("./user-stores.service");
describe('UserStoresService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [user_stores_service_1.UserStoresService]
        });
    });
    it('should be created', testing_1.inject([user_stores_service_1.UserStoresService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=user-stores.service.spec.js.map