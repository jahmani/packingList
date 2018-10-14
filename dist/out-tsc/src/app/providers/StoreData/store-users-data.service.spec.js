"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var store_users_data_service_1 = require("./store-users-data.service");
describe('StoreUsersDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [store_users_data_service_1.StoreUsersDataService]
        });
    });
    it('should be created', testing_1.inject([store_users_data_service_1.StoreUsersDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=store-users-data.service.spec.js.map