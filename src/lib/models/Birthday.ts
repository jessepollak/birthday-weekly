import moment, { Moment } from 'moment'
import { fetchConnectionBirthdays } from '../../lib/googleConnections'
import User from './User'
import BirthdayPreferences, { BirthdayPreferencesRepository } from './BirthdayPreferences'

export function deltaFromCurrentDateInDays(date: Moment) {
  const currentDate = moment.utc()
  const dateNormalizedToYear = date.clone().year(currentDate.year())
  if (dateNormalizedToYear.diff(currentDate) < 0) {
    dateNormalizedToYear.add(1, 'year')
  }

  return dateNormalizedToYear.diff(currentDate, 'days')
}

export class BirthdayRepository {
  static async getUpcomingForUser(user: User, options = { includeIgnored: false }): Promise<{ withinSevenDays, withinThirtyDays }> {
    let birthdays = await fetchConnectionBirthdays(user)
    birthdays = await BirthdayPreferencesRepository.hydrateBirthdaysWithPreferences(user, birthdays)

    if (!options.includeIgnored) {
      birthdays = birthdays.filter((b) => !b.preferences.ignore)
    }

    const birthdaysWithDelta = birthdays.map((b) => { return { birthday: b, delta: deltaFromCurrentDateInDays(b.date) } })

    const formattedBirthdayData = {
      withinSevenDays: birthdaysWithDelta.filter((b) => b.delta <= 7).sort((a, b) => a.delta - b.delta).map(b => b.birthday),
      withinThirtyDays: birthdaysWithDelta.filter((b) => b.delta > 7 && b.delta <= 30).sort((a, b) => a.delta - b.delta).map(b => b.birthday),
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
  preferences: BirthdayPreferences | undefined;

  constructor({ id, name, image, source, date }) {
    this.id = id
    this.name = name
    this.image = image
    this.source = source
    this.date = date
  }
}