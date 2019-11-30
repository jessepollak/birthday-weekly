import express from 'express'
import passport from 'passport'
import session from 'express-session'
import bodyParser from 'body-parser'
import { UserRepository } from '../../lib/models/user'
import { GoogleOAuthStrategy, AMPBearerStrategy } from '../../lib/authentication'
import { addRoutes as addAuthRoutes } from './auth'

export function createRouter() {
  const router = express.Router()

  router.use(session({ 
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }))
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(passport.initialize())
  router.use(passport.session())

  passport.use('google-oauth-strategy', GoogleOAuthStrategy)
  passport.use('amp-bearer-strategy', AMPBearerStrategy)

  passport.serializeUser((user: { id: string }, done) => {
    console.log(user)
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    const user = await UserRepository.find(id)
    done(null, user)
  })

  addAuthRoutes(router)

  return router
}