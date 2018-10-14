"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var invites_service_1 = require("./invites.service");
describe('InvitesService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [invites_service_1.InvitesService]
        });
    });
    it('should be created', testing_1.inject([invites_service_1.InvitesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=invites.service.spec.js.map