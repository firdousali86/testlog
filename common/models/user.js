"use strict";

var serverConfig = require("../config/serverConfig.js");
var eventHelper = require("../helpers/eventHelper.js");
var errorHelper = require("../helpers/errorHelper.js");
var commonHelper = require("../helpers/commonHelper.js");
var path = require("path");

module.exports = function(User) {
  function userVerificationOnSignup(userObject, cb) {
    var options = {
      type: "email",
      to: userObject.email,
      from: "noreply@loopback.com",
      subject: "Thanks for registering.",
      template: path.resolve(
        __dirname,
        "../../common/templates/verifySignupEmail.ejs"
      ),
      redirect: "/verified",
      user: User,
      userFullName: userObject.fullLegalName,
      host: serverConfig.absServerAddress,
      protocol: "http",
      port: serverConfig.serverPort
    };

    userObject.verify(options, function(err, response) {
      if (err) {
        User.deleteById(userObject.id);
        return cb(err);
      } else {
        cb();
      }
    });
  }

  User.afterRemote("confirm", function(ctx, results, next) {
    ctx.res.redirect(
      "http://" +
        serverConfig.absServerAddress +
        ":" +
        serverConfig.serverPort +
        "/redirectToLogin"
    );
  });

  /////////////////////////////////////////////////////////////////////////

  User.signup = function(data, cb) {
    data.email = data.email.toLowerCase();

    User.create(data, function(err, createdUser) {
      cb(err, createdUser);
    });
  };

  User.remoteMethod("signup", {
    accepts: [{ arg: "data", type: "object", http: { source: "body" } }],
    returns: { type: "object", root: true },
    http: {
      path: "/signup",
      verb: "post",
      status: 201
    }
  });

  User.afterRemote("signup", function(context, userInstance, next) {
    userInstance.emailVerified = false;
    userVerificationOnSignup(userInstance, next);
  });

  /////////////////////////////////////////////////////////////////////////

  User.beforeRemote("login", function(ctx, modelInstance, next) {
    var credentials = ctx.args.credentials;
    var userObject;

    credentials.email = credentials.email.toLowerCase();
    ctx.args.credentials = credentials;

    User.find({ where: { email: credentials.email } }, function(
      err,
      resultArray
    ) {
      if (resultArray && resultArray.length > 0) {
        userObject = resultArray[0];

        userObject.hasPassword(credentials.password, function(err, isMatch) {
          if (isMatch) {
            if (!userObject.emailVerified && userObject.verificationToken) {
              next(errorHelper.emailUnverifiedError());
            } else if (
              !userObject.emailVerified &&
              !userObject.verificationToken
            ) {
              userVerificationOnSignup(userObject, next);
            } else {
              next();
            }
          } else {
            //WRONG PASSWORD
            if (userObject.wrongPassLimitReached == true) {
              next(errorHelper.getWrongPasswordLimitError());
            } else {
              eventHelper.markWrongLoginAttempt(
                User.app,
                credentials,
                userObject,
                next
              );
            }
          }
        });
      } else {
        //WRONG EMAIL
        next();
      }
    });
  });

  User.afterRemote("login", function(ctx, modelInstance, next) {
    if (ctx.result) {
      User.find(
        {
          // include: [
          //   "policies",
          //   "warranties",
          //   "assets",
          //   "dependents",
          //   "beneficiaries",
          //   "claims",
          //   "wishlists",
          //   "wills"
          // ],
          where: { id: ctx.result.userId }
        },
        function(err, resultArray) {
          var userObject = resultArray[0];

          if (userObject.wrongPassLimitReached == true) {
            next(errorHelper.getWrongPasswordLimitError());
          } else if (userObject.isTemporarilyBlocked == true) {
            next(errorHelper.getVerificationRequiredError());
          } else {
            commonHelper.setFinalObject(ctx, userObject);
            eventHelper.updateUserParams(User.app, userObject);
            next();
          }
        }
      );
    } else {
      next();
    }
  });

  /////////////////////////////////////////////////////////////////////////

  User.beforeRemote("**", function(ctx, user, next) {
    console.log(ctx.methodString, "was invoked remotely"); // customers.prototype.save was invoked remotely
    next();
  });
};
