import express from 'express'
import weeklyEmail from './weeklyEmail'

exports.createRouter = function() {
  const scheduledRouter = express.Router()

  scheduledRouter.get('/test', (req, res) => {
    console.log("Test")
    res.send("Scheduled Test")
  })

  scheduledRouter.post('/weekly-email', weeklyEmail)

  return scheduledRouter
}