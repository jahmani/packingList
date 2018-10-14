"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var images_data_service_1 = require("./images-data.service");
describe('ImagesDataService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [images_data_service_1.ImagesDataService]
        });
    });
    it('should be created', testing_1.inject([images_data_service_1.ImagesDataService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=images-data.service.spec.js.map