import express from "express";
import { BirthdayPreferencesRepository } from "../../lib/models/BirthdayPreferences";
import Birthday, { BirthdayRepository } from "../../lib/models/Birthday";
import User from "../../lib/models/User";

export default function createRouter() {
  const router = express.Router()

  router.put('/:id/', async (req, res) => {
    const birthday = req.body as Birthday

    const preferences = {
      ignore: birthday.preferences.ignore || false
    }

    const updatedPreference = await BirthdayPreferencesRepository.update(req.user, birthday, preferences)
    birthday.preferences = updatedPreference

    return res.json(birthday)
  })

  router.get('/upcoming', async (req, res) => {
    const user = req.user as User
    return res.json(await BirthdayRepository.getUpcomingForUser(user))
  })

  return router
}
