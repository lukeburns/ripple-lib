'use strict';

function getMantissaDecimalString(bignum) {
  let mantissa = bignum.toPrecision(16)
    .replace(/\./, '')      // remove decimal point
    .replace(/e.*/, '')     // remove scientific notation
    .replace(/^0*/, '');    // remove leading zeroes
  while (mantissa.length < 16) {
    mantissa += '0';        // add trailing zeroes until length is 16
  }
  return mantissa;
}

function trace(comment, func) {
  return function() {
    console.log('%s: %s', trace, arguments.toString);
    func(arguments);
  };
}

function arraySet(count, value) {
  const a = new Array(count);

  for (let i = 0; i < count; i++) {
    a[i] = value;
  }

  return a;
}

function hexToString(h) {
  const a = [];
  let i = 0;

  if (h.length % 2) {
    a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)));
    i = 1;
  }

  for (; i < h.length; i += 2) {
    a.push(String.fromCharCode(parseInt(h.substring(i, i + 2), 16)));
  }

  return a.join('');
}

function stringToHex(s) {
  let result = '';
  for (let i = 0; i < s.length; i++) {
    const b = s.charCodeAt(i);
    result += b < 16 ? '0' + b.toString(16) : b.toString(16);
  }
  return result;
}

function stringToArray(s) {
  const a = new Array(s.length);

  for (let i = 0; i < a.length; i += 1) {
    a[i] = s.charCodeAt(i);
  }

  return a;
}

function hexToArray(h) {
  return stringToArray(hexToString(h));
}

function arrayToHex(a) {
  return a.map(function(byteValue) {
    const hex = byteValue.toString(16);
    return hex.length > 1 ? hex : '0' + hex;
  }).join('');
}

function chunkString(str, n, leftAlign) {
  const ret = [];
  let i = 0;
  const len = str.length;

  if (leftAlign) {
    i = str.length % n;
    if (i) {
      ret.push(str.slice(0, i));
    }
  }

  for (; i < len; i += n) {
    ret.push(str.slice(i, n + i));
  }

  return ret;
}

function assert(assertion, msg) {
  if (!assertion) {
    throw new Error('Assertion failed' + (msg ? ': ' + msg : '.'));
  }
}

/**
 * @param {Array} arr (values)
 * @return {Array} unique values (for string representation of value) in `arr`
 */
function arrayUnique(arr) {
  const u = {}, a = [];

  for (let i = 0, l = arr.length; i < l; i++) {
    const k = arr[i];
    if (u[k]) {
      continue;
    }
    a.push(k);
    u[k] = true;
  }

  return a;
}

/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 *
 */
function toTimestamp(rpepoch) {
  return (rpepoch + 0x386D4380) * 1000;
}

/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since ripple epoch ( 1/1/2000 GMT)
 */
function fromTimestamp(timestamp) {
  const timestamp_ = timestamp instanceof Date ?
                     timestamp.getTime() :
                     timestamp;
  return Math.round(timestamp_ / 1000) - 0x386D4380;
}

exports.time = {
  fromRipple: toTimestamp,
  toRipple: fromTimestamp
};

exports.trace = trace;
exports.arraySet = arraySet;
exports.hexToString = hexToString;
exports.hexToArray = hexToArray;
exports.stringToArray = stringToArray;
exports.stringToHex = stringToHex;
exports.arrayToHex = arrayToHex;
exports.chunkString = chunkString;
exports.assert = assert;
exports.arrayUnique = arrayUnique;
exports.toTimestamp = toTimestamp;
exports.fromTimestamp = fromTimestamp;
exports.getMantissaDecimalString = getMantissaDecimalString;

exports.sjcl = require('sjcl-extended');

// vim:sw=2:sts=2:ts=8:et
