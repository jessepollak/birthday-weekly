const express = require('express')
const scheduled = require('./src/scheduled')
const api = require('./api')

const app = express()

api.initialize(app)
scheduled.initialize(app)

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});



