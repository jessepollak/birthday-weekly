import express from 'express'
import weeklyEmail from './weeklyEmail'
import passport from 'passport'

export function createRouter() {
  const router = express.Router()
  // router.use(passport.authenticate('google-scheduler-bearer', { session: false }))

  router.post('/test', (req, res) => {
    console.log('Test')
    res.send('Scheduled Test')
  })

  router.post('/weekly-email', weeklyEmail)

  return router
}