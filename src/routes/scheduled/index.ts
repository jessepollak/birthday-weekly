import express from 'express'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import weeklyEmail from './weeklyEmail'

export function createRouter() {
  const router = express.Router()
  router.use(passport.authenticate('google-scheduler-bearer', { session: false }))

  router.post('/test', (req, res) => {
    console.log('Test')
    res.send('Scheduled Test')
  })

  router.post('/weekly-email', weeklyEmail)

  return router
}