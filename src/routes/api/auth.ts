import passport from 'passport'

export function addRoutes(router) {
  router.get(
    '/auth/google',
    passport.authenticate('google-oauth-strategy', {
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
    passport.authenticate('google-oauth-strategy', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/dashboard')
    }
  )
}