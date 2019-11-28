const sendgrid = require('@sendgrid/mail')

exports.configure = function configure(apiKey) {
  sendgrid.setApiKey(apiKey)
}

exports.sendWeeklyEmail = async function(to, formattedBirthdayData) {
  sendgrid.send({
    to: to,
    from: 'birthdayweekly@pollak.io',
    templateId: 'd-d1384c7dfa09484c9e5c1d1922485de6',
    dynamic_template_data: {
      birthdays: formattedBirthdayData
    },
  })
}

exports.sendEmail = async function sendEmail(to, subject, text) {
  await sendgrid.send({
    to: to,
    from: 'jesse@example.com',
    subject: subject,
    text: text
  })
}