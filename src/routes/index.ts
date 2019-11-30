import express from 'express'
import { createRouter as createAPIRouter } from './api'
import { createRouter as createScheduledRouter } from './scheduled'

export default function createExpressApp() {
  const app = express()

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