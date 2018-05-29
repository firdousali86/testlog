var appConfig = {};

appConfig.targets = {};
appConfig.targets.redirectUrls = {};

appConfig.targets.redirectUrls.development = "autCon://";
appConfig.targets.redirectUrls.prestaging = "autCon://";
appConfig.targets.redirectUrls.staging = "autCon://";
appConfig.targets.redirectUrls.production = "autCon://";

appConfig.targets.redirectURL =
  appConfig.targets.redirectUrls[process.env.NODE_ENV];

appConfig.platformId = 3;
appConfig.maxTokenExpiryTimeInMins = 30;
appConfig.numOfDaysToReevaluate = 15;

module.exports = appConfig;
