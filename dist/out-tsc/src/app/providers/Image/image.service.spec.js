"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var image_service_1 = require("./image.service");
describe('ImageService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [image_service_1.ImageService]
        });
    });
    it('should be created', testing_1.inject([image_service_1.ImageService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=image.service.spec.js.map