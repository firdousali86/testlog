"use strict";

var loopback = require("loopback");
var boot = require("loopback-boot");
var path = require("path");
var errorHandler = require("strong-error-handler");

var errorHelper = require("../common/helpers/errorHelper.js");

var app = (module.exports = loopback());

// configure view handler
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  loopback.token({ model: app.models.accessToken, currentUserLiteral: "me" })
);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit("started");
    var baseUrl = app.get("url").replace(/\/$/, "");
    console.log("Web server listening at: %s", baseUrl);
    if (app.get("loopback-component-explorer")) {
      var explorerPath = app.get("loopback-component-explorer").mountPath;
      console.log("Browse your REST API at %s%s", baseUrl, explorerPath);
    }
  });
};

////////////////////////ERROR HANDLING////////////////////////////////

app.use(function myErrorLogger(err, req, res, next) {
  if (
    err.statusCode == 401 &&
    err.status == 401 &&
    err.code == "INVALID_TOKEN"
  ) {
    next(errorHelper.getInvalidTokenError());
  } else if (
    (err.statusCode == 404 || err.status == 404) &&
    err.code == "MODEL_NOT_FOUND"
  ) {
    next(errorHelper.getUserNotFoundError());
  } else {
    next(err);
  }
});

app.use(
  errorHandler({
    debug: app.get("env") === "development",
    log: true
  })
);

////////////////////////////////////////////////////////////////////

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});
