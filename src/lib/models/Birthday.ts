import moment, { Moment } from 'moment'
import { fetchConnectionBirthdays } from '../../lib/googleConnections'
import User from './User'

export function isWithinDays(numDays: number, date: Moment) {
  const currentDate = moment.utc()
  const dateNormalizedToYear = date.clone().year(currentDate.year())
  if (dateNormalizedToYear.diff(currentDate) < 0) {
    dateNormalizedToYear.add(1, 'year')
  }

  const dayDifference = dateNormalizedToYear.diff(currentDate, 'days')
  return dayDifference <= numDays && dayDifference >= 0
}

export class BirthdayRepository {
  static async getUpcomingForUser(user: User): Promise<{ withinSevenDays, withinThirtyDays }> {
    const birthdays = await fetchConnectionBirthdays(user)

    const formattedBirthdayData = {
      withinSevenDays: [],
      withinThirtyDays: []
    }

    for (let birthday of birthdays) {
      if (isWithinDays(7, birthday.date)) {
        formattedBirthdayData.withinSevenDays.push(birthday)
      } else if (isWithinDays(30, birthday.date)) {
        formattedBirthdayData.withinThirtyDays.push(birthday)
      }
    }

    return formattedBirthdayData
  }
}

export default class Birthday {
  id: string;
  name: string;
  image: string | undefined;
  source: "google" = "google";
  date: Moment;

  constructor({ id, name, image, source, date }) {
    this.id = id
    this.name = name
    this.image = image
    this.source = source
    this.date = date
  }
}