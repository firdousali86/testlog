var appConfig = require("../config/appConfig.js");
var cryptoHelper = require("../helpers/cryptoHelper.js");

module.exports.getCurrentTimestamp = function getCurrentTimestamp() {
  return Math.round(+new Date() / 1000);
};
