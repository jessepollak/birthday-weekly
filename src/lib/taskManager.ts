import { CloudTasksClient } from '@google-cloud/tasks'
import express from 'express'
import url from 'url'
import path from 'path'
import passport from 'passport'

interface TaskManagerConfiguration {
  project?: string
  location?: string
  baseURL?: string
  serviceAccountEmail?: string
}

type TaskQueue = 'tasks'
type TaskPath = (
  '/test' |
  '/schedule-weekly-email' | 
  '/send-weekly-email'
)

class TaskManager {
  configuration: TaskManagerConfiguration
  client: CloudTasksClient
  routes: object = {}

  configure(configuration: TaskManagerConfiguration) {
    this.client = new CloudTasksClient({
      credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('ascii'))
    })
    this.configuration = configuration
  }

  createRouter() {
    const router = express.Router()
    router.use(passport.authenticate('google-tasks-bearer', { session: false }))

    for (var route in this.routes) {
      router.post(route, this.routes[route])
    }

    return router
  }

  registerTask(path: TaskPath, handler) {
    this.routes[path] = handler
  }

  async enqueue(queue: TaskQueue, path: TaskPath, payload = {}, delayInSeconds = 0) {
    const parent = this.client.queuePath(
      this.configuration.project, 
      this.configuration.location, 
      queue
    )

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: this.createURL(path),
        oidcToken: {
          serviceAccountEmail: this.configuration.serviceAccountEmail
        },
        body: undefined
      },
      scheduleTime: {}
    }
    
    if (Object.keys(payload).length) {
      task.httpRequest.body = Buffer.from(JSON.stringify(payload)).toString('base64')
    }
    
    if (delayInSeconds) {
      // The time when the task is scheduled to be attempted.
      task.scheduleTime = {
        seconds: delayInSeconds + Date.now() / 1000,
      }
    }
    
    console.log('Sending task:')
    console.log(task)
    // Send create task request.
    const request = { parent, task }
    return this.client.createTask(request)
  }

  createURL(p) {
    return url.resolve(this.configuration.baseURL, path.join('/tasks', p))
  }
}

export default new TaskManager()