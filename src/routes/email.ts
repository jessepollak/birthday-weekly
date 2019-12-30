import express from 'express'
import previewEmail from 'preview-email'
import { UserRepository } from '../lib/models/User'
import { ContactRepository } from '../lib/models/Contact'
import email from '../lib/email'

export function createRouter() {
  const router = express.Router()

  router.get('/weekly', async (req, res) => {
    const user = (await UserRepository.all())[0]
    const upcomingContacts = await ContactRepository.fetchContactsWithUpcomingBirthdays(user)

    const rendered = await email.render('weekly', {
      withinSevenDays: upcomingContacts.withinSevenDays,
      withinThirtyDays: upcomingContacts.withinThirtyDays,
      manageURL: `${process.env.BASE_URL}/`
    })

    const file = await previewEmail(rendered, { open: false })

    return res.sendFile(file.match(/file:\/\/\/(.*)/)[1], { root: '/' })
  })

  return router
}