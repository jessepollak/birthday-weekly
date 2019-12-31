import tasks from '../../lib/taskManager'
import sendWeeklyEmail from './sendWeeklyEmail'
import scheduleWeeklyEmail from './scheduleWeeklyEmail'

export function createRouter() {
  tasks.configure({
    project: process.env.GOOGLE_PROJECT_ID,
    serviceAccountEmail: process.env.GOOGLE_TASKS_IDENTITY_EMAIL,
    baseURL: process.env.BASE_URL,
    location: 'us-east1'
  })

  tasks.registerTask('/test', (req, res) => {
    console.log('Test')
    res.send('Scheduled Test')
  })

  tasks.registerTask('/schedule-weekly-email', scheduleWeeklyEmail)
  tasks.registerTask('/send-weekly-email', sendWeeklyEmail)

  return tasks.createRouter()
}