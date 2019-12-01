import express from 'express'
import passport from 'passport'
import { JWTManager } from '../lib/authentication'

export function createRouter() {
  const router = express.Router()

  router.get(
    '/google',
    passport.authenticate('google-oauth', {
      // @ts-ignore accessType added to type yet
      accessType: 'offline',
      prompt: 'consent',
      scope: [
        'email',
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/contacts'
      ]
    })
  )

  router.get(
    '/google/callback',
    passport.authenticate('google-oauth', { failureRedirect: '/' }),
    (req, res) => {
      const jwtManager = new JWTManager()
      jwtManager.setCookie(req.user, res)
      res.redirect('/dashboard')
    }
  )

  router.get(
    '/logout',
    (req, res) => {
      const jwtManager = new JWTManager()
      jwtManager.clearCookie(res)
      res.redirect('/')
    }
  )

  return router 
}