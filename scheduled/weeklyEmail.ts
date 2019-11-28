import moment, { Moment } from 'moment'
import { loadCredentialsAndExecute } from '../src/googleAuth'
import { fetchConnectionBirthdays, Connection } from '../src/googleConnections'
import * as email from '../src/email'
import { Request, Response } from 'express'

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

  const connections: Array<Connection> = await loadCredentialsAndExecute(fetchConnectionBirthdays) as Array<Connection>

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

  email.sendWeeklyEmail('jesse@pollak.io', formattedBirthdayData)

  res.send("OK")
}