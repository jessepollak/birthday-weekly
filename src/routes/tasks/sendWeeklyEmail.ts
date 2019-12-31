import { UserRepository } from '../../lib/models/User'
import email from '../../lib/email'
import { ContactRepository } from '../../lib/models/Contact'

export default async function sendWeeklyEmail(req, res) {
  console.log(req.body)

  const user = await UserRepository.find(req.body.userId)
  const upcomingContacts = await ContactRepository.fetchContactsWithUpcomingBirthdays(user)

  email.sendWeeklyEmail(user.email, {
    withinSevenDays: upcomingContacts.withinSevenDays,
    withinThirtyDays: upcomingContacts.withinThirtyDays
  })

  res.send("OK")
}