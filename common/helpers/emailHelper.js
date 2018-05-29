var fs = require("fs");
var handlebars = require("handlebars");

module.exports.emailDocument = function emailDocument(
  app,
  templateName,
  templateData,
  emailData,
  cb,
  filePath,
  targetFileName,
  footerTemplate
) {
  var emailWillTemplate = fs.readFileSync(
    __dirname + "/../templates/" + templateName + ".md"
  );
  var emailTemplate = handlebars.compile(String(emailWillTemplate));

  var superEmailTemplate = fs.readFileSync(
    __dirname + "/../templates/superEmailTemplate.md"
  );
  superEmailTemplate = handlebars.compile(String(superEmailTemplate));

  var emailFooterTemplate;

  if (!footerTemplate) {
    footerTemplate = "defaultEmailFooter";
  }

  emailFooterTemplate = fs.readFileSync(
    __dirname + "/../templates/" + footerTemplate + ".md"
  );
  emailFooterTemplate = handlebars.compile(String(emailFooterTemplate));

  var recipients;

  if (Array.isArray(emailData.recipients)) {
    recipients = emailData.recipients.join();
  } else {
    recipients = emailData.recipients;
  }

  var superEmailTemplateData = {
    emailTitle: emailData.subject,
    content: emailTemplate(templateData),
    footer: emailFooterTemplate
  };

  var emailObject = {
    to: recipients,
    subject: emailData.subject,
    html: superEmailTemplate(superEmailTemplateData)
  };

  if (filePath && targetFileName) {
    emailObject.attachments = [
      {
        filename: targetFileName,
        path: attachment
      }
    ];
  }

  app.models.Email.send(emailObject, function(err, mail) {
    cb(err, mail);
  });
};
