"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_models_1 = require("../../interfaces/data-models");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var firebase = require("firebase");
var compare_timetamp_1 = require("../../Util/compare-timetamp");
var FirestoreData = /** @class */ (function () {
    function FirestoreData(afs, path) {
        this.afs = afs;
        console.log("Hello FBRepository Provider");
        if (typeof path === "string") {
            this.initialize(path);
        }
        else if (path instanceof rxjs_1.Observable) {
            this.reactiveInitialize(path);
        }
    }
    Object.defineProperty(FirestoreData.prototype, "FormatedList", {
        get: function () {
            return this.dataList;
        },
        enumerable: true,
        configurable: true
    });
    FirestoreData.prototype.reactiveInitialize = function (path$) {
        var _this = this;
        this.path$ = path$;
        var snapshotChanges = path$
            .pipe(operators_1.switchMap(function (path) {
            _this.path = path;
            _this.collection = _this.afs.collection(path);
            return _this.collection.snapshotChanges();
        }))
            .pipe(operators_1.share());
        this.initData(snapshotChanges);
    };
    FirestoreData.prototype.initData = function (snapshotChanges) {
        this.dataList = this.snapList(snapshotChanges).pipe(operators_1.publishReplay(1), operators_1.refCount());
        this.dataMap = this.snapshotMap(snapshotChanges).pipe(operators_1.publishReplay(1), operators_1.refCount());
    };
    FirestoreData.prototype.initialize = function (path) {
        this.path = path;
        this.path$ = rxjs_1.of(path);
        console.log("path : " + path + " ");
        this.collection = this.afs.collection(path);
        var snapshotChanges = this.collection.snapshotChanges().pipe(operators_1.share());
        this.initData(snapshotChanges);
    };
    FirestoreData.prototype.snapList = function (snapshotChanges) {
        var _this = this;
        return snapshotChanges.pipe(operators_1.map(function (actions) {
            return actions
                .map(function (a) { return _this.extractSnapshotData(a.payload.doc); })
                .sort(function (a, b) {
                return compare_timetamp_1.compareTimeStamp(a.data.lastEditedOn, b.data.lastEditedOn);
            });
        }));
    };
    FirestoreData.prototype.snapshotMap = function (snapshotChanges) {
        var _this = this;
        return snapshotChanges.pipe(operators_1.map(function (actions) {
            var _map = new data_models_1.ExtMap();
            actions.forEach(function (a) {
                var docData = _this.extractSnapshotData(a.payload.doc);
                _map.set(docData.id, docData);
            });
            return _map;
        }));
    };
    FirestoreData.prototype.List = function () {
        return this.dataList;
    };
    FirestoreData.prototype.get = function (key) {
        var _this = this;
        return this.path$
            .pipe(operators_1.switchMap(function (path) {
            return _this.afs.doc(path + ("/" + key)).snapshotChanges();
        }))
            .pipe(operators_1.map(function (a) { return _this.extractSnapshotData(a.payload); }));
    };
    FirestoreData.prototype.extractSnapshotData = function (snapshot) {
        var meta = snapshot.metadata;
        var data;
        if (snapshot.exists) {
            data = snapshot.data();
        }
        else {
            console.log("Empty doc snapshot :", snapshot);
        }
        var id = snapshot.id;
        var ret = { id: id, data: data, ext: {}, meta: meta };
        return ret;
    };
    FirestoreData.prototype.getOnce = function (key) {
        return this.get(key)
            .pipe(operators_1.first())
            .toPromise();
    };
    FirestoreData.prototype.getOrCreate = function (key) {
        return this.getOnce(key)
            .then(function (val) { return val; })
            .catch(function (err) {
            console.log("getOrCreate err : ", err);
            return { id: key, data: null };
        });
    };
    FirestoreData.prototype.parseBeforeSave = function (obj) {
        return { id: obj.id, data: this.remove$Properties(obj.data) };
    };
    FirestoreData.prototype.remove$Properties = function (obj) {
        Object.keys(obj).forEach(function (key) {
            if (key.startsWith("$")) {
                delete obj[key];
            }
        });
    };
    FirestoreData.prototype.catch = function (err) {
        console.error("Error saving", err);
        throw err;
    };
    FirestoreData.prototype.saveNew = function (item, key) {
        key = key || this.newKey();
        this.parseBeforeSave(item);
        item.data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
        item.data.firstCreatedOn = firebase.firestore.FieldValue.serverTimestamp();
        if (key) {
            return this.collection
                .doc(key)
                .set(item.data)
                .then(function () { return key; })
                .catch(this.catch);
        }
    };
    FirestoreData.prototype.remove = function (item) {
        // this.parseBeforeSave(item);
        return this.collection
            .doc(item.id)
            .delete()
            .catch(this.catch);
        // return this.fbLoggableSaver.remove(item, this.urlOrRef)
    };
    FirestoreData.prototype.newKey = function () {
        return this.collection.ref.firestore
            .collection(this.collection.ref.path)
            .doc().id;
    };
    FirestoreData.prototype.saveOld = function (editedItem) {
        // let key = editedItem.$key;
        var data = editedItem.data;
        data.lastEditedOn = firebase.firestore.FieldValue.serverTimestamp();
        // this.parseBeforeSave(copy);
        return this.collection
            .doc(editedItem.id)
            .update(data)
            .catch(this.catch);
    };
    return FirestoreData;
}());
exports.FirestoreData = FirestoreData;
//# sourceMappingURL=firestore-data.js.map