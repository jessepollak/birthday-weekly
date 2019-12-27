import express from 'express'
import createUserRouter from './users'
import createContactRouter from './contacts'
import passport from 'passport'
import { AuthenticationTypes } from "../../lib/authentication"

export function createRouter() {
  const router = express.Router()
  router.use(express.json())

  router.use(passport.authenticate(AuthenticationTypes.JWT, { session: false }))
  router.use('/users', createUserRouter())
  router.use('/contacts', createContactRouter())

  return router
}