import express from 'express'
import { configure as configureAuth } from './authentication'

export function createRouter() {
  const router = express.Router()
  configureAuth(router)

  router.get('/', (req, res) => {
    res.send('Hello world!')
  })

  router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
  })

  return router
}