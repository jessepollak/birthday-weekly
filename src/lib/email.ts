import EmailTemplates from 'email-templates'
import sendgrid from '@sendgrid/mail'
import mjml2html from 'mjml'


class Email {
  templater: EmailTemplates

  configure(apiKey: string) {
    sendgrid.setApiKey(apiKey)

    this.templater = new EmailTemplates({
      views: {
        root: 'src/emails',
        options: {
          extension: 'ejs'
        },
        preview: {
          open: false
        }
      }
    })
  }

  async render(template, variables) {
    const rendered = await  this.templater.renderAll(template, variables)
    const mjml = mjml2html(rendered.html)

    rendered.html = mjml.html

    if (mjml.errors?.length) {
      console.error(mjml.errors)
    }

    return rendered
  }

  async send(to: string, subject: string, template: string, variables) {
    const rendered = await this.render(template, variables)

    sendgrid.send({
      to,
      from: 'birthdayweekly@pollak.io',
      subject,
      html: rendered.html,
      text: rendered.text
    })
  }

  async sendWeeklyEmail(to: string, formattedBirthdayData) {
    return this.send(
      to,
      'Upcoming birthdays...',
      'weekly',
      {
        withinSevenDays: formattedBirthdayData.withinSevenDays,
        withinThirtyDays: formattedBirthdayData.withinThirtyDays,
        manageURL: `${process.env.BASE_URL}/`
      }
    )
  }
}

export default new Email()

