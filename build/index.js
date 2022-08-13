"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = exports.collapse = exports.padZeros = exports.randomId = exports.byteString = exports.shrinkUrl = exports.timeFromNow = void 0;
function timeFromNow(ISO) {
    var now = (new Date()).getTime();
    var past = (new Date(ISO)).getTime();
    var diff = (now - past) / 1000;
    if (diff < 60)
        return 'now';
    if (diff > 24 * 3600)
        return "".concat(Math.floor(diff / 3600 / 24), " days ago");
    if (diff > 3600)
        return "".concat(Math.floor(diff / 3600), " hours ago");
    return "".concat(Math.floor(diff / 60), " minutes ago");
}
exports.timeFromNow = timeFromNow;
function shrinkUrl(url, softMaxLength) {
    if (softMaxLength === void 0) { softMaxLength = 150; }
    if (url.length < softMaxLength)
        return url;
    var parsed = new URL(url);
    var pathNamePieces = parsed.pathname.split('/');
    var lastPathName = pathNamePieces.pop();
    var first = parsed.origin;
    var last = '/' + lastPathName + parsed.search + parsed.hash;
    return first + '/...' + last;
}
exports.shrinkUrl = shrinkUrl;
function byteString(fileSize) {
    if (fileSize < 0)
        return '-' + byteString(-fileSize);
    if (fileSize > 1000000000000) {
        return (fileSize / 1000000000000.0)
            .toFixed(2) + " Tb";
    }
    else if (fileSize > 1000000000) {
        return (fileSize / 1000000000.0)
            .toFixed(2) + " Gb";
    }
    else if (fileSize > 1000000) {
        return (fileSize / 1000000.0)
            .toFixed(2) + " Mb";
    }
    else if (fileSize > 1000) {
        return (fileSize / 1000.0)
            .toFixed(2) + " kb";
    }
    else {
        return fileSize + " bytes";
    }
}
exports.byteString = byteString;
function randomId() {
    return Math.random().toString(36).substring(7);
}
exports.randomId = randomId;
function padZeros(value, dim) {
    var result = (typeof value !== 'string' ? value.toString() : value);
    dim -= result.length;
    for (var i = 0; i < dim; i++)
        result = '0' + result;
    return result;
}
exports.padZeros = padZeros;
function collapse(text, limit) {
    if (limit === void 0) { limit = 150; }
    if (text.length < limit)
        return text;
    var start = text.substring(0, 70);
    var end = text.substring(text.length - 70);
    return start + ' ... ' + end;
}
exports.collapse = collapse;
function pickRandom(list) {
    if (list.length === 0)
        return null;
    if (list.length === 1)
        return list[0];
    var num = Math.round(Math.random() * list.length);
    if (num === list.length)
        num = list.length - 1;
    return list[num];
}
exports.pickRandom = pickRandom;
