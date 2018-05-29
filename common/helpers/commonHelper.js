var waterfall = require("async-waterfall");
var async = require("async");
var utils = require("../utils/utils.js");

module.exports.setFinalObject = function setFinalObject(ctx, obj) {
  obj.accessToken = ctx.result.id;
  obj.userId = ctx.result.userId;
  obj.ttl = ctx.result.ttl;

  delete obj.password;

  ctx.result = obj;
};

module.exports.disableAllMethods = function disableAllMethods(
  model,
  methodsToExpose
) {
  if (model && model.sharedClass) {
    methodsToExpose = methodsToExpose || [];

    var modelName = model.sharedClass.name;
    var methods = model.sharedClass.methods();
    var relationMethods = [];
    var hiddenMethods = [];

    try {
      Object.keys(model.definition.settings.relations).forEach(function(
        relation
      ) {
        relationMethods.push({
          name: "__findById__" + relation,
          isStatic: false
        });
        relationMethods.push({
          name: "__destroyById__" + relation,
          isStatic: false
        });
        relationMethods.push({
          name: "__updateById__" + relation,
          isStatic: false
        });
        relationMethods.push({
          name: "__exists__" + relation,
          isStatic: false
        });
        relationMethods.push({ name: "__link__" + relation, isStatic: false });
        relationMethods.push({ name: "__get__" + relation, isStatic: false });
        relationMethods.push({
          name: "__create__" + relation,
          isStatic: false
        });
        relationMethods.push({
          name: "__update__" + relation,
          isStatic: false
        });
        relationMethods.push({
          name: "__destroy__" + relation,
          isStatic: false
        });
        relationMethods.push({
          name: "__unlink__" + relation,
          isStatic: false
        });
        relationMethods.push({ name: "__count__" + relation, isStatic: false });
        relationMethods.push({
          name: "__delete__" + relation,
          isStatic: false
        });
      });
    } catch (err) {}

    methods.concat(relationMethods).forEach(function(method) {
      var methodName = method.name;
      if (methodsToExpose.indexOf(methodName) < 0) {
        hiddenMethods.push(methodName);
        model.disableRemoteMethod(methodName, method.isStatic);
      }
    });

    if (hiddenMethods.length > 0) {
      console.log(
        "\nRemote methods hidden for",
        modelName,
        ":",
        hiddenMethods.join(", "),
        "\n"
      );
    }
  }
};
