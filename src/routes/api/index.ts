import express from 'express'
import createUserRouter from './users'
import createBirthdayRouter from './birthdays'
import passport from 'passport'
import { AuthenticationTypes } from "../../lib/authentication"

export function createRouter() {
  const router = express.Router()
  router.use(express.json())

  router.use(passport.authenticate(AuthenticationTypes.JWT, { session: false }))
  router.use('/users', createUserRouter())
  router.use('/birthdays', createBirthdayRouter())

  return router
}