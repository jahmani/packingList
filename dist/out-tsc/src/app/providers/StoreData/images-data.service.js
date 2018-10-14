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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_data_service_1 = require("./store-data.service");
var firestore_1 = require("@angular/fire/firestore");
var active_store_service_1 = require("../AppData/active-store.service");
var StorePathConfig_1 = require("../../interfaces/StorePathConfig");
var image_service_1 = require("../Image/image.service");
var ImagesDataService = /** @class */ (function (_super) {
    __extends(ImagesDataService, _super);
    function ImagesDataService(afs, activeStoreService, imageService) {
        var _this = _super.call(this, afs, activeStoreService, StorePathConfig_1.StorePathConfig.Images) || this;
        _this.activeStoreService = activeStoreService;
        _this.imageService = imageService;
        console.log("Hello ImagesFsRepository Provider");
        return _this;
    }
    ImagesDataService.prototype.beforeImageUploaded = function (newImage, newId) {
        return _super.prototype.saveNew.call(this, newImage, newId);
    };
    ImagesDataService.prototype.beforeImageRemoved = function (newImage) {
        newImage.data.isDelted = true;
        return _super.prototype.saveOld.call(this, newImage);
    };
    ImagesDataService.prototype.afterImageRemoved = function (removedItem) {
        _super.prototype.remove.call(this, removedItem);
    };
    ImagesDataService.prototype.getByUrl = function (url) {
        var imageId = this.imageService.getImageId(url);
        return this.getOnce(imageId);
    };
    ImagesDataService.prototype.saveNewImage = function (imgMeta, id) {
        var _this = this;
        id = id || this.newKey();
        var newItem = {
            height: imgMeta.height,
            //  name: imgMeta.imageId,
            size: imgMeta.size,
            width: imgMeta.width
        };
        return this.beforeImageUploaded({ data: newItem, id: null }, id).then(function (key) {
            return _this.imageService
                .upload(imgMeta, key, _this.activeStoreService.activeStoreKey)
                .then(function (res) {
                return Promise.all([res.imageTask, res.thumbTask]).then(function (_a) {
                    var imgSnapshot = _a[0], thumbSnapshot = _a[1];
                    newItem.url = imgSnapshot.downloadURL;
                    newItem.thumbUrl = thumbSnapshot.downloadURL;
                    return _this.afterImageUploaded(null, { data: newItem, id: id });
                });
            });
        });
    };
    ImagesDataService.prototype.remove = function (removedItem) {
        var _this = this;
        return this.beforeImageRemoved(removedItem).then(function () {
            return _this.imageService.remove(removedItem.data).then(function (removeRes) {
                return _this.afterImageRemoved(removedItem);
            });
        });
    };
    ImagesDataService.prototype.afterImageUploaded = function (oldImage, newImage) {
        return _super.prototype.saveOld.call(this, newImage);
    };
    ImagesDataService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore,
            active_store_service_1.ActiveStoreService,
            image_service_1.ImageService])
    ], ImagesDataService);
    return ImagesDataService;
}(store_data_service_1.StoreDataService));
exports.ImagesDataService = ImagesDataService;
//# sourceMappingURL=images-data.service.js.map