import { Collection, getRepository } from 'fireorm'
import Birthday from './Birthday';

@Collection()
export default class BirthdayPreferences {
  id: string | undefined;
  userId: string | undefined;

  ignore: boolean;

  static createDefault(userId, id) {
    const preferences = new BirthdayPreferences()
    preferences.id = id
    preferences.userId = userId
    preferences.ignore = false
    return preferences
  }
}

export class BirthdayPreferencesRepository {
  static async update(user, birthday, preferences) {
    let persisted = true
    let currentPreferences = (await this.repository()
      .whereEqualTo('userId', user.id)
      .whereEqualTo('id', birthday.id)
      .find()
    )[0]

    if (!currentPreferences) {
      persisted = false
      currentPreferences = BirthdayPreferences.createDefault(user.id, birthday.id)
    }

    for (let preference in preferences) {
      currentPreferences[preference] = preferences[preference]
    }

    if (persisted) {
      return this.repository().update(currentPreferences)
    } else {
      return this.repository().create(currentPreferences)
    }
  }

  static async hydrateBirthdaysWithPreferences(user, birthdays) {
    const preferences = (await this.repository()
      .whereEqualTo('userId', user.id)
      .find())
      .reduce((mem, curr) => {
        mem[curr.id] = curr
        return mem
      }, {})

    for (let birthday of birthdays) {
      if (preferences[birthday.id]) {
        birthday.preferences = preferences[birthday.id]
      } else {
        birthday.preferences = BirthdayPreferences.createDefault(user.id, birthday.id)
      }
    }

    return birthdays
  }

  static repository() {
    return getRepository(BirthdayPreferences)
  }
}