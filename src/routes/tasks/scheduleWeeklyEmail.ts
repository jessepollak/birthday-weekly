import { Request, Response } from 'express'
import { UserRepository } from '../../lib/models/User'
import tasks from '../../lib/taskManager'

export default async function weeklyEmail(req: Request, res: Response) {
  const users = await UserRepository.all()

  for (let user of users) {
    tasks.enqueue('scheduled', '/send-weekly-email', {
      userId: user.id
    })
  }

  res.send("OK")
}