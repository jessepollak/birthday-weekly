import express from "express";
import passport from "passport"
import User from "../../lib/models/User";

export default function createRouter() {
  const router = express.Router()

  router.get('/me', (req, res) => {
    const user = req.user as User

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  })

  return router
}
