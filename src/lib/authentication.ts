import { OAuth2Strategy } from 'passport-google-oauth'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as PassportJWTStrategy } from 'passport-jwt'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import User, { UserRepository, UserGoogleCredentials } from './models/User'

export const AuthenticationTypes = {
  GoogleOauth: 'google-oauth',
  AmpBearer: 'amp-bearer',
  GoogleTasksBearer: 'google-tasks-bearer',
  JWT: 'jwt'
}

export const AMPBearerStrategy = new BearerStrategy(async function(token, done) {
  return done(null, false)
})

export const GoogleTasksBearerStrategy = new BearerStrategy(
  async function(token, done) {
    if (!process.env.GOOGLE_TASKS_IDENTITY_EMAIL) {
      console.warn('No tasks email configured, therefore cannot authenticate.')
      throw new Error('Missing configuration')
    }

    const emailToVerify = process.env.GOOGLE_TASKS_IDENTITY_EMAIL
    const verifyURL = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    const rawResponse = await fetch(verifyURL)
    const data = await rawResponse.json()

    if (rawResponse.status != 200 || data.error !== undefined) {
      return done(null, false)
    }

    if (!emailToVerify || (data.email !== emailToVerify && data.email_verified == true)) {
      return done(null, false)
    }

    return done(null, data, { message: 'success', scope: 'run_tasks' })
  }
)

let callbackURL = '/auth/google/callback'
if (process.env.BASE_URL) {
  callbackURL = process.env.BASE_URL + callbackURL
}

export const GoogleOAuthStrategy = new OAuth2Strategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: callbackURL
}, async (accessToken, refreshToken, profile, done) => {
  const user = await UserRepository.findOrCreateByGoogleProfileId(profile.id, {
    name: profile.displayName,
    email: profile.emails[0].value,
    googleCredentials: {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  })

  return done(null, user)
})

const JWT_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 30
const JWT_SECRET = process.env.JWT_SECRET

export class JWTManager {
  private user: User

  static JWT_SECRET = process.env.JWT_SECRET
  static JWT_EXPIRY_MS = 1000 * 60 * 60 * 24 * 30

  public setCookie(user, res) {
    const payload = {
      sub: user.id,
      expires: Date.now() + JWT_EXPIRATION_MS,
    }

    const jwtSigned = jwt.sign(JSON.stringify(payload), JWT_SECRET)
    res.cookie(
      'jwt',
      jwtSigned,
      { 
        httpOnly: true, 
        secure: process.env.NODE_ENV !== 'development', 
        sameSite: true
      }
    )

    return res
  }

  public clearCookie(res) {
    res.cookie('jwt', { expires: Date.now() })
  }
}

export const JWTStrategy = new PassportJWTStrategy({
  secretOrKey: JWTManager.JWT_SECRET,
  jwtFromRequest: (req) => {
    return req.cookies && req.cookies.jwt
  },
}, async (payload, done) => {
  try {
    const user = await UserRepository.find(payload.sub)
    if (user) return done(null, user) 
    return done(null, false)
  } catch (err) {
    return done(err, false)
  }
})