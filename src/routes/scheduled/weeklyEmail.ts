import moment, { Moment } from 'moment'
import { fetchConnectionBirthdays, Connection } from '../../lib/googleConnections'
import * as email from '../../lib/email'
import { Request, Response } from 'express'
import { UserRepository } from '../../lib/models/User'

function isWithinDays(numDays: number) {
  return (date: Moment) => {
    const targetDate = moment().add(numDays, 'days')
    const isWithinCurrentYear = date.dayOfYear() >= moment().dayOfYear() && date.dayOfYear() <= targetDate.dayOfYear()
    const isInNewYear = date.dayOfYear() <= targetDate.dayOfYear() && moment().year() < targetDate.year()
    return isWithinCurrentYear || isInNewYear
  }
}

function formatForEmail(connection: Connection) {
  let age
  if (connection.birthday.year() === moment().year() || connection.birthday.year() === 0) {
    age = "Unknown"
  } else {
    age = moment().year() - connection.birthday.year() 

    // If in the new year, add one
    if (connection.birthday.dayOfYear() < moment().dayOfYear()) {
      age += 1
    }
  }

  return {
    name: connection.name,
    age: age,
    birthday: connection.birthday.format("MMMM Do (YYYY)")
  }
}

export default async function weeklyEmail(req: Request, res: Response) {
  email.configure(process.env.SENDGRID_API_KEY as string)

  const users = await UserRepository.all()

  for (let user of users) {
    const connections: Array<Connection> = await fetchConnectionBirthdays(user)

    const formattedBirthdayData = {
      withinSevenDays: [],
      withinThirtyDays: []
    }

    for (let connection of connections) {
      if (isWithinDays(7)(connection.birthday)) {
        formattedBirthdayData.withinSevenDays.push(formatForEmail(connection))
      } else if (isWithinDays(30)(connection.birthday)) {
        formattedBirthdayData.withinThirtyDays.push(formatForEmail(connection))
      }
    }

    email.sendWeeklyEmail(user.email, formattedBirthdayData)
  }

  res.send("OK")
}