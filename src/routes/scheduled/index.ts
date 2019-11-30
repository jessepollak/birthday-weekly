import express from 'express'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import { GoogleSchedulerBearerStrategy } from '../../lib/authentication'
import weeklyEmail from './weeklyEmail'

function configureAuthentication(router) {
  router.use(passport.initialize())
  passport.use(GoogleSchedulerBearerStrategy)
  router.use(passport.authenticate('bearer', { session: false }))
}

export function createRouter() {
  const router = express.Router()
  configureAuthentication(router)

  router.post('/test', (req, res) => {
    console.log('Test')
    res.send('Scheduled Test')
  })

  router.post('/weekly-email', weeklyEmail)

  return router
}