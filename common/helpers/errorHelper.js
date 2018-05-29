module.exports.getWrongPasswordLimitError = function getWrongPasswordLimitError() {
  var err = new Error("Suspicious Activity, need verification code to proceed");
  err.statusCode = 423;
  err.code = "WRONG_PASSWORD_LIMIT_REACHED";
  return err;
};

module.exports.getVerificationRequiredError = function getVerificationRequiredError() {
  var err = new Error("Suspicious Activity, need verification code to proceed");
  err.statusCode = 423;
  err.code = "VERIFICATION_REQUIRED";
  return err;
};

module.exports.getWrongCredentialsError = function getWrongCredentialsError() {
  var err = new Error("Sorry, but that email and password do not match!");
  err.statusCode = 401;
  err.code = "LOGIN_FAILED";
  return err;
};

module.exports.getOldPasswordMismatchError = function getOldPasswordMismatchError() {
  var err = new Error("Sorry, but the old password is not correct");
  err.statusCode = 401;
  err.code = "INCORRECT_PASSWORD";
  return err;
};

module.exports.emailUnverifiedError = function emailUnverifiedError() {
  var err = new Error("Sorry, but please verfy your email and try again!");
  err.statusCode = 401;
  err.code = "LOGIN_FAILED";
  return err;
};

module.exports.getPassCodeError = function getPassCodeError() {
  var err = new Error("Sorry, but that verification code does not work!");
  err.statusCode = 401;
  err.code = "LOGIN_FAILED";
  return err;
};

module.exports.getCustomerVerificationCodeError = function getCustomerVerificationCodeError() {
  var err = new Error(
    "Sorry! The message code is not correct. Please email x@assetvault.co for support or contact your Insurance/Banking partner."
  );
  err.statusCode = 401;
  err.code = "CUSTOMER_VERIFICATION_CODE_FAILED";
  return err;
};

module.exports.getCarEvaluationError = function getCarEvaluationError() {
  var err = new Error("Sorry! Can't find price at this time.");
  err.statusCode = 401;
  err.code = "VEHICLE_EVALUATION_FAILED";
  return err;
};

module.exports.getInvalidTokenError = function getInvalidTokenError() {
  var err = new Error(
    "You've been logged out due to inactivity. Please log in again to continue using your AssetVault account"
  );
  err.statusCode = 401;
  err.code = "USER_TOKEN_EXPIRED";
  return err;
};

module.exports.getUserNotFoundError = function getUserNotFoundError() {
  var err = new Error("Oops! Something went wrong, please re login");
  err.statusCode = 404;
  err.code = "MODEL_NOT_FOUND";
  return err;
};

module.exports.getAuthRequiredError = function getAuthRequiredError() {
  var err = new Error("You are unauthorized to perform this action");
  err.statusCode = 404;
  err.code = "AUTHORIZATION_REQUIRED";
  return err;
};
