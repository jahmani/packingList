"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataModels = /** @class */ (function () {
    function DataModels() {
    }
    return DataModels;
}());
exports.DataModels = DataModels;
var ExtMap = /** @class */ (function () {
    function ExtMap(vals) {
        this.map = new Map(vals);
    }
    ExtMap.prototype.toArray = function () {
        return Array.from(this.map.values());
    };
    ExtMap.prototype.get = function (key) {
        return this.map.get(key);
    };
    ExtMap.prototype.set = function (key, value) {
        return this.map.set(key, value);
    };
    ExtMap.prototype.forEach = function (callbackfn, thisArg) {
        return this.map.forEach(callbackfn);
    };
    return ExtMap;
}());
exports.ExtMap = ExtMap;
var AccountType;
(function (AccountType) {
    AccountType[AccountType["GeneralCredit"] = -1] = "GeneralCredit";
    AccountType[AccountType["GeneralDebt"] = 1] = "GeneralDebt";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Credit"] = -1] = "Credit";
    TransactionType[TransactionType["Debt"] = 1] = "Debt";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var ItemChangeState;
(function (ItemChangeState) {
    ItemChangeState[ItemChangeState["INITIALISED"] = 0] = "INITIALISED";
    ItemChangeState[ItemChangeState["ADDED"] = 1] = "ADDED";
    ItemChangeState[ItemChangeState["CHANGED"] = 2] = "CHANGED";
    ItemChangeState[ItemChangeState["REMOVED"] = 3] = "REMOVED";
})(ItemChangeState = exports.ItemChangeState || (exports.ItemChangeState = {}));
var ItemEditState;
(function (ItemEditState) {
    ItemEditState[ItemEditState["ADD"] = 0] = "ADD";
    ItemEditState[ItemEditState["CHANGE"] = 1] = "CHANGE";
    ItemEditState[ItemEditState["REMOVE"] = 2] = "REMOVE";
})(ItemEditState = exports.ItemEditState || (exports.ItemEditState = {}));
//# sourceMappingURL=data-models.js.map