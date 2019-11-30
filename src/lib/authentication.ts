import { OAuth2Strategy } from 'passport-google-oauth'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import fetch from 'node-fetch'
import { UserRepository, UserGoogleCredentials } from '../lib/models/user'

export const AMPBearerStrategy = new BearerStrategy(async function(token, done) {
  return done(null, false)
})

export const GoogleSchedulerBearerStrategy = new BearerStrategy(
  async function(token, done) {
    if (!process.env.GOOGLE_SCHEDULER_IDENTITY_EMAIL) {
      console.warn('No scheduler email configured, therefore cannot authenticate.')
      throw new Error('Missing configuration')
    }

    const emailToVerify = process.env.GOOGLE_SCHEDULER_IDENTITY_EMAIL
    const verifyURL = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    const rawResponse = await fetch(verifyURL)
    const data = await rawResponse.json()

    console.log(data)

    if (rawResponse.status != 200 || data.error !== undefined) {
      return done(null, false)
    }

    if (!emailToVerify || (data.email !== emailToVerify && data.email_verified == true)) {
      return done(null, false)
    }

    return done(null, data, { message: 'success', scope: 'run_scheduled_jobs' })
  }
)

export const GoogleOAuthStrategy = new OAuth2Strategy({
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
    }
  })
  done(null, user)
})