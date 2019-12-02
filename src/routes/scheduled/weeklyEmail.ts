import { Request, Response } from 'express'
import moment, { Moment } from 'moment'
import * as email from '../../lib/email'
import {fetchConnectionBirthdays } from '../../lib/googleConnections'
import { UserRepository } from '../../lib/models/User'
import Birthday, { BirthdayRepository } from '../../lib/models/Birthday'

function formatForEmail(birthday: Birthday) {
  let age
  if (birthday.date.year() === moment.utc().year() || birthday.date.year() === 0) {
    age = "Unknown"
  } else {
    age = moment.utc().year() - birthday.date.year() 

    // If in the new year, add one
    if (birthday.date.dayOfYear() < moment.utc().dayOfYear()) {
      age += 1
    }
  }

  return {
    name: birthday.name,
    age: age,
    birthday: birthday.date.format("MMMM Do (YYYY)")
  }
}

export default async function weeklyEmail(req: Request, res: Response) {
  email.configure(process.env.SENDGRID_API_KEY as string)

  const users = await UserRepository.all()

  for (let user of users) {
    const upcomingBirthdays = await BirthdayRepository.getUpcomingForUser(user)
    email.sendWeeklyEmail(user.email, {
      withinSevenDays: upcomingBirthdays.withinSevenDays.map(formatForEmail),
      withinThirtyDays: upcomingBirthdays.withinThirtyDays.map(formatForEmail)
    })
  }

  res.send("OK")
}