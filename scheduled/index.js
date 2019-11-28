const express = require('express')
const weeklyEmail = require('./weeklyEmail')

exports.createRouter = function() {
  const scheduledRouter = express.Router()

  scheduledRouter.get('/test', (req, res) => {
    console.log("Test")
    res.send("Scheduled Test")
  })

  scheduledRouter.get('/weekly-email', weeklyEmail)

  return scheduledRouter
}