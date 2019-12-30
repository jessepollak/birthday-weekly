import { Request, Response } from 'express'
import email from '../../lib/email'
import { ContactRepository } from '../../lib/models/Contact'
import { UserRepository } from '../../lib/models/User'

export default async function weeklyEmail(req: Request, res: Response) {
  const users = await UserRepository.all()

  for (let user of users) {
    const upcomingContacts = await ContactRepository.fetchContactsWithUpcomingBirthdays(user)
    email.sendWeeklyEmail(user.email, {
      withinSevenDays: upcomingContacts.withinSevenDays,
      withinThirtyDays: upcomingContacts.withinThirtyDays
    })
  }

  res.send("OK")
}