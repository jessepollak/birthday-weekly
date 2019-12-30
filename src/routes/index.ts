import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import passport from 'passport'
import path from 'path'
import { AMPBearerStrategy, AuthenticationTypes, GoogleOAuthStrategy, GoogleSchedulerBearerStrategy, JWTStrategy } from '../lib/authentication'
import { UserRepository } from '../lib/models/User'
import { createRouter as createAPIRouter } from './api'
import { createRouter as createAuthRouter } from './auth'
import { createRouter as createEmailRouter } from './email'
import { createRouter as createScheduledRouter } from './scheduled'

function setupAuth(app) {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(passport.initialize())

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', '..', 'client/build')))
  }

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

  if (process.env.NODE_ENV === 'development') {
    app.use('/email', createEmailRouter())
  }

  app.get('/*', (req, res) => {
    res.sendFile('client/build/index.html', { root: path.join(__dirname, '..', '..') })
  })

  return app
}