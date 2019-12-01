var proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  )

  app.use(
    '/auth',
    proxy({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  )
}