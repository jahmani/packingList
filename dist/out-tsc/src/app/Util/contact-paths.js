"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function conatctPaths() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return pathJoin(parts, "/");
}
exports.conatctPaths = conatctPaths;
function pathJoin(parts, sep) {
    var separator = sep || "/";
    var replace = new RegExp(separator + "{1,}", "g");
    return parts.join(separator).replace(replace, separator);
}
//# sourceMappingURL=contact-paths.js.map