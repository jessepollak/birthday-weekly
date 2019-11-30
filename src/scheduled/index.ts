import express from 'express'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import weeklyEmail from './weeklyEmail'

function configureAuthentication(router) {
  router.use(passport.initialize())

  if (!process.env.GOOGLE_SCHEDULER_IDENTITY_EMAIL) {
    console.warn('No scheduler email configured, therefore cannot authenticate.')
    throw new Error('Missing configuration')
  }

  passport.use(new BearerStrategy(
    async function(token, done) {
      const emailToVerify = process.env.GOOGLE_SCHEDULER_IDENTITY_EMAIL
      const verifyURL = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
      const rawResponse = await fetch(verifyURL)
      const data = await rawResponse.json()

      console.log(data)

      if (rawResponse.status != 200 || data.error !== undefined) {
        return done(null, false, { message: 'Bad request' })
      }

      if (!emailToVerify || (data.email !== emailToVerify && data.email_verified == true)) {
        return done(null, false, { message: 'Bad authentication' })
      }

      return done(null, data, { scope: 'run_scheduled_jobs' })
    }
  ))

  router.use(passport.authenticate('bearer', { session: false }))

  return router
}

export function createRouter() {
  const router = express.Router()
  router.use(bodyParser.urlencoded({ extended: false }))
  configureAuthentication(router)

  router.post('/test', (req, res) => {
    console.log('Test')
    res.send('Scheduled Test')
  })

  router.post('/weekly-email', weeklyEmail)

  return router
}