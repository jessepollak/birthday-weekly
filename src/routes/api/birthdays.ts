import express from "express";
import { BirthdayPreferencesRepository } from "../../lib/models/BirthdayPreferences";
import Birthday, { BirthdayRepository } from "../../lib/models/Birthday";
import User from "../../lib/models/User";

export default function createRouter() {
  const router = express.Router()

  router.put('/:id/', async (req, res) => {
    const preferences = {
      ignore: req.body.preferences.ignore || false
    }

    return res.json(await BirthdayPreferencesRepository.update(req.user, req.body as Birthday, preferences))
  })

  router.get('/upcoming', async (req, res) => {
    const user = req.user as User
    return res.json(await BirthdayRepository.getUpcomingForUser(user))
  })

  return router
}
