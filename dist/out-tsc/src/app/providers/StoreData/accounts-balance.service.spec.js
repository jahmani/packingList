"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var accounts_balance_service_1 = require("./accounts-balance.service");
describe('AccountsBalanceService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [accounts_balance_service_1.AccountsBalanceService]
        });
    });
    it('should be created', testing_1.inject([accounts_balance_service_1.AccountsBalanceService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=accounts-balance.service.spec.js.map