"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_data_1 = require("../AppData/firestore-data");
var contact_paths_1 = require("../../Util/contact-paths");
var StorePathConfig_1 = require("../../interfaces/StorePathConfig");
var operators_1 = require("rxjs/operators");
var StoreDataService = /** @class */ (function (_super) {
    __extends(StoreDataService, _super);
    function StoreDataService(afs, ass, dataSubPath) {
        return _super.call(this, afs, ass.activeStoreKey$.pipe(operators_1.map(function (storePath) {
            return contact_paths_1.conatctPaths(StorePathConfig_1.StorePathConfig.basePath, storePath, dataSubPath);
        }))) || this;
    }
    return StoreDataService;
}(firestore_data_1.FirestoreData));
exports.StoreDataService = StoreDataService;
//# sourceMappingURL=store-data.service.js.map