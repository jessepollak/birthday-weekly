import express from 'express'

const app = express()

if (process.env.SCHEDULED_WORKER) {
  const scheduled = require('./scheduled')
  const scheduledRouter = scheduled.createRouter()
  app.use('/scheduled', scheduledRouter)
} else {
  const api = require('./api')
  api.initialize(app)
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});




