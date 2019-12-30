import moment, { Moment } from 'moment'
import { fetchConnections } from '../googleConnections'
import User from './User'
import { Collection, getRepository } from 'fireorm'

export class ContactRepository {
  static async fetchAndUpdateContactsFromGoogle(user: User) {
    let freshContactsFromGoogle = await fetchConnections(user)

    let existingContacts = (await this.fetchContacts(user)).reduce((memo, next) => {
      memo[next.id] = next
      return memo
    }, {})

    const contacts = []

    let batch = this.repository.createBatch()
    let batchCounter = 0
    let contact

    for (let contactData of freshContactsFromGoogle) {
      contact = Contact.createFromGoogle(user, contactData)
      let existing = existingContacts[contact.id]

      if (existing) {
        existing.updateFromGoogle(contact)
        batch.update(existing)
        contacts.push(existing)
      } else {
        batch.create(contact)
        contacts.push(contact)
      }

      batchCounter++
      if (batchCounter === 499) {
        await batch.commit()
        batch = this.repository.createBatch()
        batchCounter = 0
      }
    }

    await batch.commit()
    
    return contacts
  }

  static fetchContacts(user: User) {
    return this.repository.whereEqualTo('userId', user.id).find()
  }

  static async fetchContactsWithUpcomingBirthdays(user: User, options = { includeIgnored: false, update: false }): Promise<{ withinSevenDays, withinThirtyDays }> {
    let contacts

    if (options.update) {
      contacts = await this.fetchAndUpdateContactsFromGoogle(user)
    } else {
      contacts = await this.fetchContacts(user)
    }

    contacts = contacts.filter(c => c.birthday)

    if (!options.includeIgnored) {
      contacts = contacts.filter((c) => !c.preferences.ignore)
    }
    const formattedBirthdayData = {
      withinSevenDays: contacts.filter((c) => c.deltaFromBirthdayInDays <= 7).sort((a, b) => a.deltaFromBirthdayInDays - b.deltaFromBirthdayInDays),
      withinThirtyDays: contacts.filter((c) => c.deltaFromBirthdayInDays > 7 && c.deltaFromBirthdayInDays <= 30).sort((a, b) => a.deltaFromBirthdayInDays - b.deltaFromBirthdayInDays),
    }

    return formattedBirthdayData
  }

  static async updateIgnorePreference(user, contactId, preference) {
    let contact = await this.repository.findById(contactId)
    if (contact.userId !== user.id) {
      throw new Error("Unauthorized")
    }

    contact.preferences.ignore = preference
    return this.repository.update(contact)
  }

  static get repository() {
    return getRepository(Contact)
  }
}

@Collection()
export default class Contact {
  id: string;
  userId; string;
  name: string;
  image: string | undefined;
  source: "google" = "google";
  birthday: Date | undefined;
  preferences: {
    ignore: boolean;
  } = {
    ignore: false
  };

  get deltaFromBirthdayInDays() {
    const currentDate = moment.utc()
    const birthdayNormalizedToYear = moment.utc(this.birthday).year(currentDate.year())
    if (birthdayNormalizedToYear.diff(currentDate) < 0) {
      birthdayNormalizedToYear.add(1, 'year')
    }

    return birthdayNormalizedToYear.diff(currentDate, 'days')
  }

  get age() {
    let age
    const birthday = moment.utc(this.birthday)
    if (birthday.year() === moment.utc().year() || birthday.year() === 0) {
      return "Unknown"
    } else {
      age = moment.utc().year() - birthday.year() 

      // If in the new year, add one
      if (birthday.dayOfYear() < moment.utc().dayOfYear()) {
        age += 1
      }
    }

    return age
  }

  get formattedBirthday() {
    return moment.utc(this.birthday).format('MMM Do')
  }

  updateFromGoogle(contact) {
    if (contact.birthday) this.birthday = contact.birthday
    if (contact.image) this.image = contact.image
    if (contact.name) this.name = contact.name
    return contact
  }

  static createFromGoogle(user, person) {
    const normalizeId = function(resourceName) {
      return resourceName.match(/people\/(\w+)/)[1]
    }

    const contact = new Contact()
    contact.userId = user.id
    contact.id = normalizeId(person.resourceName)
    // contact.preferences = Object.assign({}, Contact.prototype.preferences)

    if (person.names?.length) {
      contact.name = person.names[0].displayName
    }
    contact.source = 'google'

    if (person.birthdays?.length) {
      const { day, month, year } = person.birthdays[0].date
      contact.birthday = moment.utc({ day, month: month - 1, year }).toDate()
    }

    return contact
  }
}

