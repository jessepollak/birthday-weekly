import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import passport from 'passport'
import { AMPBearerStrategy, AuthenticationTypes, GoogleOAuthStrategy, GoogleSchedulerBearerStrategy, JWTStrategy } from '../lib/authentication'
import { UserRepository } from '../lib/models/User'
import { createRouter as createAPIRouter } from './api'
import { createRouter as createAuthRouter } from './auth'
import { createRouter as createScheduledRouter } from './scheduled'

function setupAuth(app) {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(passport.initialize())

  passport.use(AuthenticationTypes.GoogleOauth, GoogleOAuthStrategy)
  passport.use(AuthenticationTypes.AmpBearer, AMPBearerStrategy)
  passport.use(AuthenticationTypes.GoogleSchedulerBearer, GoogleSchedulerBearerStrategy)
  passport.use(AuthenticationTypes.JWT, JWTStrategy)

  passport.serializeUser((user: { id: string }, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    const user = await UserRepository.find(id)
    done(null, user)
  })

  app.use('/auth', createAuthRouter())
}
export default function createExpressApp() {
  const app = express()
  setupAuth(app)

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