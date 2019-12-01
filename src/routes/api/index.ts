import express from 'express'
import createUserRouter from './users'
import passport from 'passport'
import { AuthenticationTypes } from "../../lib/authentication"

export function createRouter() {
  const router = express.Router()

  router.use(passport.authenticate(AuthenticationTypes.JWT, { session: false }))
  router.use('/users', createUserRouter())

  return router
}