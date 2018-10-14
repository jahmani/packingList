"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var accounts_data_service_1 = require("./accounts-data.service");
describe('AccountsDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [accounts_data_service_1.AccountsDataService]
        });
    });
    it('should be created', testing_1.inject([accounts_data_service_1.AccountsDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=accounts-data.service.spec.js.map