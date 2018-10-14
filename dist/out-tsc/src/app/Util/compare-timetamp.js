"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compareTimeStamp(d1, d2) {
    var firstDate = Number.MAX_VALUE;
    var secondDate = Number.MAX_VALUE;
    if (d1) {
        firstDate = new Date(d1).getTime();
    }
    if (d2) {
        secondDate = new Date(d2).getTime();
    }
    return secondDate - firstDate;
}
exports.compareTimeStamp = compareTimeStamp;
//# sourceMappingURL=compare-timetamp.js.map