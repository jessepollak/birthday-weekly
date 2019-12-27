import { Request, Response } from 'express'
import moment, { Moment } from 'moment'
import * as email from '../../lib/email'
import { UserRepository } from '../../lib/models/User'
import Contact, { ContactRepository } from '../../lib/models/Contact'

function formatForEmail(contact: Contact) {
  let age
  const birthday = moment.utc(contact.birthday)
  if (birthday.year() === moment.utc().year() || birthday.year() === 0) {
    age = "Unknown"
  } else {
    age = moment.utc().year() - birthday.year() 

    // If in the new year, add one
    if (birthday.dayOfYear() < moment.utc().dayOfYear()) {
      age += 1
    }
  }

  return {
    name: contact.name,
    age: age,
    contact: birthday.format("MMMM Do (YYYY)")
  }
}

export default async function weeklyEmail(req: Request, res: Response) {
  email.configure(process.env.SENDGRID_API_KEY as string)

  const users = await UserRepository.all()

  for (let user of users) {
    const upcomingContacts = await ContactRepository.fetchContactsWithUpcomingBirthdays(user)
    email.sendWeeklyEmail(user.email, {
      withinSevenDays: upcomingContacts.withinSevenDays.map(formatForEmail),
      withinThirtyDays: upcomingContacts.withinThirtyDays.map(formatForEmail)
    })
  }

  res.send("OK")
}