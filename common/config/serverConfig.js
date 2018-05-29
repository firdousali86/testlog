var serverConfig = {};

serverConfig.servers = {};
serverConfig.apiServers = {};
serverConfig.absServersURL = {};
serverConfig.portalsURL = {};
serverConfig.ports = {};

var devURL = "0.0.0.0"; //'ec2-35-156-74-164.eu-central-1.compute.amazonaws.com';
var prestagingURL = "apistg.assetvault.io"; //'ec2-52-214-129-211.eu-west-1.compute.amazonaws.com';
var stagingURL = "apistg.assetvault.io"; //'ec2-52-19-90-168.eu-west-1.compute.amazonaws.com';
var productionURL = "api.assetvault.io"; //'assetvaultone-env.eu-central-1.elasticbeanstalk.com';

var devPort = "3000";
var pstgPort = "3000";
var stgPort = "3000";
var prodPort = "443";

serverConfig.absServersURL.development = devURL;
serverConfig.absServersURL.prestaging = prestagingURL;
serverConfig.absServersURL.staging = stagingURL;
serverConfig.absServersURL.production = productionURL;

serverConfig.servers.development = "http://" + devURL + ":" + devPort;
serverConfig.servers.prestaging = "https://" + prestagingURL + ":" + pstgPort;
serverConfig.servers.staging = "https://" + stagingURL + ":" + stgPort;
serverConfig.servers.production = "https://" + productionURL;

serverConfig.apiServers.development = serverConfig.servers.development + "/api";
serverConfig.apiServers.prestaging = serverConfig.servers.prestaging + "/api";
serverConfig.apiServers.staging = serverConfig.servers.staging + "/api";
serverConfig.apiServers.production = serverConfig.servers.production + "/api";

serverConfig.ports.development = devPort;
serverConfig.ports.prestaging = pstgPort;
serverConfig.ports.staging = stgPort;
serverConfig.ports.production = prodPort;

serverConfig.absServerAddress =
  serverConfig.absServersURL[process.env.NODE_ENV];
serverConfig.serverURL = serverConfig.servers[process.env.NODE_ENV];
serverConfig.apiServerURL = serverConfig.apiServers[process.env.NODE_ENV];
serverConfig.serverPort = serverConfig.ports[process.env.NODE_ENV];

module.exports = serverConfig;
