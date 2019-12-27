import express from "express"
import { ContactRepository } from "../../lib/models/Contact"
import User from "../../lib/models/User"

export default function createRouter() {
  const router = express.Router()

  router.put('/:id/', async (req, res) => {
    const contact = await ContactRepository.updateIgnorePreference(req.user, req.body.id, req.body.preferences.ignore || false)
    return res.json(contact)
  })

  router.get('/upcoming', async (req, res) => {
    const user = req.user as User
    return res.json(await ContactRepository.fetchContactsWithUpcomingBirthdays(user, { includeIgnored: true, update: true }))
  })

  return router
}
