"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var transactions_data_service_1 = require("./transactions-data.service");
describe('TransactionsDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [transactions_data_service_1.TransactionsDataService]
        });
    });
    it('should be created', testing_1.inject([transactions_data_service_1.TransactionsDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=transactions-data.service.spec.js.map