import sendgrid from '@sendgrid/mail'

export function configure(apiKey: string) {
  sendgrid.setApiKey(apiKey)
}

export async function sendWeeklyEmail(to: string, formattedBirthdayData: Object) {
  sendgrid.send({
    to: to,
    from: 'birthdayweekly@pollak.io',
    templateId: 'd-d1384c7dfa09484c9e5c1d1922485de6',
    dynamicTemplateData: {
      birthdays: formattedBirthdayData
    },
  })
}