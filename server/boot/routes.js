// var dsConfig = require('../datasources.json');
// var serverConfig = require('../../common/config/serverConfig.js');
// var path = require('path');
// var appConfig = require('../../common/config/appConfig.js');
// var linkedinHelper = require('../../common/helpers/linkedinHelper.js');
// var utils = require('../../common/utils/utils.js');

// module.exports = function (app) {
//     var User = app.models.user;

//     app.get('/verified', function (req, res) {
//         res.render('verified', { loginURL: serverConfig.portalURL });
//     });

//     app.get('/testcookie', function (req, res) {
//         res.render('testcookie');
//     });

//     app.get('/auth/linkedin', function (req, res) {
//         linkedinHelper.handleLinkedInAuth(app, req, res);
//     });

//     app.get('/login/linkedin', function (req, res) {
//         linkedinHelper.redirectToLNLogin(req, res);
//     });

//     app.get('/redirectToLogin', function (req, res) {
//         res.render('redirectToApp', { weburl: serverConfig.portalURL + '/login?source=redirected', appurl: appConfig.targets.redirectURL });
//     });

//     // app.get('/testurl', function(req, res) {
//     //     console.log(req.device);
//     //     res.send("Hi to "+req.device.type.toUpperCase()+" User");
//     //  res.sendFile(path.join(__dirname + '/../pages/redirectToApp.html'));
//     // });
// };
