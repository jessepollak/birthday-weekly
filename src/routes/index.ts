import express from 'express'
import passport from 'passport'
import session from 'express-session'
import bodyParser from 'body-parser'
import { UserRepository } from '../lib/models/User'
import { GoogleOAuthStrategy, AMPBearerStrategy, GoogleSchedulerBearerStrategy } from '../lib/authentication'
import { createRouter as createAPIRouter } from './api'
import { createRouter as createAuthRouter } from './auth'
import { createRouter as createScheduledRouter } from './scheduled'

function setupAuth(app) {
  app.use(session({ 
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use('google-oauth', GoogleOAuthStrategy)
  passport.use('amp-bearer', AMPBearerStrategy)
  passport.use('google-scheduler-bearer', GoogleSchedulerBearerStrategy)

  passport.serializeUser((user: { id: string }, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    const user = await UserRepository.find(id)
    done(null, user)
  })
}
export default function createExpressApp() {
  const app = express()
  setupAuth(app)

  app.use('/auth', createAuthRouter())
  app.use('/api', createAPIRouter())
  app.use('/scheduled', createScheduledRouter())

  app.get('/', (req, res) => {
    res.send('Hello world!')
  })

  app.get('/dashboard', (req, res) => {
    res.send('Dashboard')
  })

  return app
}