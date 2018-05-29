var CryptoJS = require("crypto-js");
var cryptoConfig = require("../config/cryptoConfig.js");
var utils = require("../utils/utils.js");

module.exports.encryptObject = function encryptObject(plainObject, callback) {
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(plainObject),
    cryptoConfig.secret
  );

  if (callback) {
    callback(ciphertext);
  } else {
    return ciphertext;
  }
};

module.exports.decryptObject = function decryptObject(encryptedText, callback) {
  var bytes = CryptoJS.AES.decrypt(
    encryptedText.toString(),
    cryptoConfig.secret
  );
  var decryptedData;
  var error;

  try {
    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    error = null;
  } catch (e) {
    error = e;
  }

  if (callback) {
    callback(error, decryptedData);
  } else {
    return decryptedData;
  }
};

module.exports.calcSHA3512Hash = function calcSHA3512Hash(string) {
  return CryptoJS.SHA3(string);
};

module.exports.calcSHAVariableLengthHash = function calcSHAVariableLengthHash(
  string,
  length
) {
  return CryptoJS.SHA3(string, { outputLength: length });
};

module.exports.calcHMACSHA3512 = function calcHMACSHA3512(string, key) {
  return CryptoJS.HmacSHA3(string, key);
};

module.exports.getRandomStream = function getRandomStream(length) {
  var hash = module.exports.calcSHA3512Hash(
    utils.getCurrentTimestamp().toString()
  );
  if (length < hash.toString().length) {
    return hash.toString().substr(0, length);
  } else {
    return hash.toString();
  }
};

module.exports.getObjectKey = function getObjectKey(app, object, cb) {
  var id = object.id;
  var createdAt = object.createdAt;

  var concatenated = createdAt + cryptoConfig.secret + id;
  var hash = module.exports.calcHMACSHA3512(concatenated, cryptoConfig.secret);
  var doublehash = module.exports.calcHMACSHA3512(hash, cryptoConfig.secret);
  doublehash = doublehash + doublehash;
  cb(null, { key: doublehash.toString().substr(0, 32) });
};
