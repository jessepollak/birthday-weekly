import express from 'express'
import createExpressApp from './routes'
import { configure as configureDatabase } from './lib/models'

const app = createExpressApp()
const database = configureDatabase(app)

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});




