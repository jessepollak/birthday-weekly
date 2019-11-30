import passport from 'passport'
import session from 'express-session'
import bodyParser from 'body-parser'
import { OAuth2Strategy } from 'passport-google-oauth'
import { UserRepository, UserGoogleCredentials } from '../lib/models/user'

export function configure(router) {
  router.use(session({ 
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }))
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(passport.initialize())
  router.use(passport.session())

  passport.serializeUser((user: { id: string }, done) => {
    console.log(user)
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    const user = await UserRepository.find(id)
    done(null, user)
  })

  passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    const user = await UserRepository.findOrCreateByGoogleProfileId(profile.id, {
      name: profile.displayName,
      email: profile.emails[0].value,
      googleCredentials: {
        accessToken: accessToken,
        refreshToken: refreshToken
      } as UserGoogleCredentials
    })
    done(null, user)
  }))

  router.get(
    '/auth/google',
    passport.authenticate('google', {
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
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/dashboard')
    }
  )
}