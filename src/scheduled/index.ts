import express from 'express'
import weeklyEmail from './weeklyEmail'

export function createRouter() {
  const router = express.Router()

  router.get('/test', (req, res) => {
    console.log("Test")
    res.send("Scheduled Test")
  })

  router.post('/weekly-email', weeklyEmail)

  return router
}