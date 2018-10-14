"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var transaction_cats_data_service_1 = require("./transaction-cats-data.service");
describe('TransactionCatsDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [transaction_cats_data_service_1.TransactionCatsDataService]
        });
    });
    it('should be created', testing_1.inject([transaction_cats_data_service_1.TransactionCatsDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=transaction-cats-data.service.spec.js.map