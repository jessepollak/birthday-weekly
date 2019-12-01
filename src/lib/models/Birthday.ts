import User from './user'
import { fetchConnectionBirthdays, Connection } from '../../lib/googleConnections'
import moment, { Moment } from 'moment'

function isWithinDays(numDays: number) {
  return (date: Moment) => {
    const targetDate = moment().add(numDays, 'days')
    const isWithinCurrentYear = date.dayOfYear() >= moment().dayOfYear() && date.dayOfYear() <= targetDate.dayOfYear()
    const isInNewYear = date.dayOfYear() <= targetDate.dayOfYear() && moment().year() < targetDate.year()
    return isWithinCurrentYear || isInNewYear
  }
}

export class BirthdayRepository {
  static async getUpcomingForUser(user: User): Promise<{ withinSevenDays, withinThirtyDays }> {
    const birthdays = await fetchConnectionBirthdays(user)

    const formattedBirthdayData = {
      withinSevenDays: [],
      withinThirtyDays: []
    }

    for (let birthday of birthdays) {
      if (isWithinDays(7)(birthday.date)) {
        formattedBirthdayData.withinSevenDays.push(birthday)
      } else if (isWithinDays(30)(birthday.date)) {
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
  source: "google";
  date: Moment;

  constructor({ id, name, image, source, date }) {
    this.id = id
    this.name = name
    this.image = image
    this.source = source
    this.date = date
  }
}