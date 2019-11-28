if (process.env.SCHEDULED_WORKER) {
  const express = require('express')
  const scheduled = require('./scheduled/index')

  const app = express()

  const scheduledRouter = scheduled.createRouter()

  app.use('/scheduled', scheduledRouter)

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log('Hello world listening on port', port);
  });
}





