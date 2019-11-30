import express from 'express'
import { createRouter as createScheduledRouter } from './scheduled'
import { createRouter as createRoutesRouter } from './routes'
import { configure as configureDatabase } from './lib/models'

const app = express()
const database = configureDatabase(app)

app.use('/', createRoutesRouter())
app.use('/scheduled', createScheduledRouter())

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});




