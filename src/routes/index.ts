import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import passport from 'passport'
import path from 'path'
import * as Sentry from '@sentry/node'
import { AMPBearerStrategy, AuthenticationTypes, GoogleOAuthStrategy, GoogleTasksBearerStrategy, JWTStrategy } from '../lib/authentication'
import { UserRepository } from '../lib/models/User'
import { createRouter as createAPIRouter } from './api'
import { createRouter as createAuthRouter } from './auth'
import { createRouter as createEmailRouter } from './email'
import { createRouter as createTasksRouter } from './tasks'

function setupAuth(app) {

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(passport.initialize())

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', '..', 'client/build')))
  }

  passport.use(AuthenticationTypes.GoogleOauth, GoogleOAuthStrategy)
  passport.use(AuthenticationTypes.AmpBearer, AMPBearerStrategy)
  passport.use(AuthenticationTypes.GoogleTasksBearer, GoogleTasksBearerStrategy)
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

  Sentry.init({ 
    dsn: 'https://dace6fc57d2a4793a7701d21ce7d1689@sentry.io/1869208',
    environment: process.env.SENTRY_ENVIRONMENT || 'development'
  })

  app.use(Sentry.Handlers.requestHandler())

  setupAuth(app)

  app.use('/api', createAPIRouter())
  app.use('/tasks', createTasksRouter())

  if (process.env.NODE_ENV === 'development') {
    app.use('/email', createEmailRouter())
  }

  app.get('/*', (req, res) => {
    res.sendFile('client/build/index.html', { root: path.join(__dirname, '..', '..') })
  })

  app.use(Sentry.Handlers.errorHandler())

  return app
}