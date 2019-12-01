import express from "express";
import passport from "passport"
import User from "../../lib/models/User";
import { BirthdayRepository } from "../../lib/models/Birthday"

export default function createRouter() {
  const router = express.Router()

  router.get('/upcoming', async (req, res) => {
    const user = req.user as User
    return res.json(await BirthdayRepository.getUpcomingForUser(user))
  })

  return router
}
