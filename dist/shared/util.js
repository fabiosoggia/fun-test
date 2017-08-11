'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validNick = validNick;
exports.findIndex = findIndex;
exports.sanitizeString = sanitizeString;
exports.isServer = isServer;
function validNick(nickname) {
    var regex = /^\w*$/;
    return regex.exec(nickname) !== null;
}

function findIndex(arr, id) {
    var len = arr.length;

    while (len--) {
        if (arr[len].id === id) {
            return len;
        }
    }

    return -1;
}

function sanitizeString(message) {
    return message.replace(/(<([^>]+)>)/ig, '').substring(0, 35);
}

function isServer() {
    if (typeof window === 'undefined') {
        return true;
    }
    return false;
}