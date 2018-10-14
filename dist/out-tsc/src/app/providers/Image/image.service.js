"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var storage_1 = require("@angular/fire/storage");
var ImageService = /** @class */ (function () {
    function ImageService(afStorage) {
        this.afStorage = afStorage;
    }
    ImageService.prototype.remove = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var imageRef, thumbRef;
            return __generator(this, function (_a) {
                imageRef = this.afStorage.storage.refFromURL(image.url);
                thumbRef = this.afStorage.storage.refFromURL(image.thumbUrl);
                return [2 /*return*/, Promise.all([imageRef.delete(), thumbRef.delete()])];
            });
        });
    };
    ImageService.prototype.upload = function (imgMeta, id, folder) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, randomId, ref, thumbRef, imageTask, thumbTask, completed;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!imgMeta.size) {
                            imgMeta.size = this.getImageSize(imgMeta.imageString);
                        }
                        if (!!imgMeta.thumbString) return [3 /*break*/, 2];
                        _a = imgMeta;
                        return [4 /*yield*/, this.generateThumb(imgMeta.imageString, 500, 500, 1, imgMeta.type)];
                    case 1:
                        _a.thumbString = _b.sent();
                        imgMeta.thumbSize = this.getImageSize(imgMeta.thumbString);
                        _b.label = 2;
                    case 2:
                        randomId = Math.random()
                            .toString(36)
                            .substring(2);
                        randomId = id ? id : randomId;
                        imgMeta.imageId = randomId;
                        ref = this.afStorage.ref(folder).child(randomId + imgMeta.ext);
                        thumbRef = this.afStorage
                            .ref(folder)
                            .child(randomId + ".thumb" + imgMeta.ext);
                        imageTask = ref.putString(imgMeta.imageString, "data_url");
                        thumbTask = thumbRef.putString(imgMeta.thumbString, "data_url");
                        completed = Promise.all([imageTask, thumbTask]);
                        imageTask.then(function (a) {
                            console.log("Done imageTask");
                            imgMeta.imageUri = a.downloadURL;
                        });
                        thumbTask.then(function (a) {
                            console.log("Done thumbTask");
                            imgMeta.thumbUri = a.downloadURL;
                        });
                        completed.then(function () { return console.log("Done uploaDING"); });
                        return [2 /*return*/, { imgMeta: imgMeta, imageTask: imageTask, thumbTask: thumbTask }];
                }
            });
        });
    };
    ImageService.prototype.generateThumb = function (img, MAX_WIDTH, MAX_HEIGHT, quality, type) {
        var _this = this;
        if (MAX_WIDTH === void 0) { MAX_WIDTH = 700; }
        if (MAX_HEIGHT === void 0) { MAX_HEIGHT = 700; }
        if (quality === void 0) { quality = 1; }
        return new Promise(function (resolve) {
            return _this.generateThumbCB(img, MAX_WIDTH, MAX_HEIGHT, quality, resolve, type);
        });
    };
    ImageService.prototype.getImageId = function (imageUrl) {
        var name;
        try {
            name = this.afStorage.storage.refFromURL(imageUrl).name;
            name = name.replace(".thumb", "");
            var dotIndex = name.lastIndexOf(".");
            name = name.substring(0, dotIndex);
            return name;
        }
        catch (err) {
            name = undefined;
        }
        finally {
            return name;
        }
    };
    ImageService.prototype.generateSquareThumb = function (img, MAX_LENGTH, quality, callback) {
        if (MAX_LENGTH === void 0) { MAX_LENGTH = 700; }
        if (quality === void 0) { quality = 1; }
        var canvas = document.createElement("canvas");
        var image = new Image();
        image.onload = function () {
            var width = image.width;
            var height = image.height;
            var srcX = 0, srcY = 0;
            var srcLength = image.height < image.width ? image.height : image.width;
            if (width > height) {
                if (width > MAX_LENGTH) {
                    height *= MAX_LENGTH / width;
                    width = MAX_LENGTH;
                    srcX = (image.width - image.height) / 2;
                }
            }
            else {
                if (height > MAX_LENGTH) {
                    width *= MAX_LENGTH / height;
                    height = MAX_LENGTH;
                    srcY = (image.height - image.width) / 2;
                }
            }
            canvas.width = MAX_LENGTH;
            canvas.height = MAX_LENGTH;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, srcX, srcY, srcLength, srcLength, 0, 0, MAX_LENGTH, MAX_LENGTH);
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL("image/jpeg", quality);
            callback(dataUrl);
        };
        image.src = img;
    };
    ImageService.prototype.generateThumbCB = function (img, MAX_WIDTH, MAX_HEIGHT, quality, callback, type) {
        if (MAX_WIDTH === void 0) { MAX_WIDTH = 700; }
        if (MAX_HEIGHT === void 0) { MAX_HEIGHT = 700; }
        if (quality === void 0) { quality = 1; }
        var canvas = document.createElement("canvas");
        var image = new Image();
        image.onload = function () {
            var width = image.width;
            var height = image.height;
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            }
            else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, width, height);
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL(type ? type : "image/jpeg", quality);
            callback(dataUrl);
        };
        image.src = img;
    };
    ImageService.prototype.getImageSize = function (data_url) {
        var head = "data:image/jpeg;base64,";
        return ((data_url.length - head.length) * 3) / 4 / (1024 * 1024);
    };
    ImageService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [storage_1.AngularFireStorage])
    ], ImageService);
    return ImageService;
}());
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map