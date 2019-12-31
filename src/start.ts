import { configure as configureDatabase } from './lib/models'
import createExpressApp from './routes'
import email from './lib/email'
import configureTasks from './routes/tasks'

const app = createExpressApp()
const database = configureDatabase(app)
email.configure(process.env.SENDGRID_API_KEY as string)

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});




