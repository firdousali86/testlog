var utils = require("../utils/utils.js");
var errorHelper = require("./errorHelper.js");
var emailHelper = require("./emailHelper.js");
var serverConfig = require("../config/serverConfig.js");

module.exports.logEvent = function logEvent(app, eventName, reason) {
  var sysLog = app.models["sysLog"];

  sysLog.upsert({
    eventName: eventName,
    reason: reason,
    timeStamp: new Date()
  });
};

module.exports.updateUserParams = function updateUserParams(app, userObject) {
  var userParam = app.models["userParam"];
  var paramObject;

  userParam.find({ where: { email: userObject.email } }, function(
    err,
    resultArray
  ) {
    if (resultArray && resultArray.length > 0) {
      paramObject = resultArray[0];
      paramObject.loginAttempt = 0;
      paramObject.lastLogin = new Date();
      userParam.upsert(paramObject);
    } else {
      paramObject = {};
      paramObject.userId = userObject.userId
        ? userObject.userId
        : userObject.id;
      paramObject.email = userObject.email;
      paramObject.loginAttempt = 0;
      paramObject.lastLogin = new Date();
      userParam.upsert(paramObject);
    }
  });
};

module.exports.markWrongLoginAttempt = function markWrongLoginAttempt(
  app,
  credentials,
  userObject,
  cb
) {
  var userParam = app.models["userParam"];
  var UserModel = app.models["customer"];
  var paramObject;

  userParam.find({ where: { email: userObject.email } }, function(
    err,
    resultArray
  ) {
    if (resultArray && resultArray.length > 0) {
      paramObject = resultArray[0];
      paramObject.loginAttempt++;
      userParam.upsert(paramObject);

      if (paramObject.loginAttempt >= 5) {
        var err = errorHelper.getWrongPasswordLimitError();
        userObject.wrongPassLimitReached = true;
        userObject.isTemporarilyBlocked = true;
        UserModel.upsert(userObject);

        var emailData = {
          recipients: userObject.email,
          subject: "Invalid Login Attempt"
        };

        var templateData = {
          userName: userObject.fullLegalName
            ? userObject.fullLegalName
            : userObject.username,
          forgotPassURL: serverConfig.portalURL + "/forgot"
        };

        emailHelper.emailDocument(
          app,
          "emailAckUserOnWrongPassAttempt",
          templateData,
          emailData,
          function(err, mail) {
            cb(err);
          }
        );
      } else {
        cb(err);
      }
    } else {
      cb(err);
    }
  });
};
