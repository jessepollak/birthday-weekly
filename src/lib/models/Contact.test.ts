import { advanceTo } from 'jest-date-mock'
import Contact from './Contact'
import moment = require('moment')

describe('deltaFromCurrentDateInDays', () => {
  test('accurately measures delta', () => {
    advanceTo(new Date(2019, 11, 1, 0, 0, 0))
    const contact = new Contact()
    contact.birthday = moment({ day: 7, month: 11, year: 1989 }).toDate()
    expect(contact.deltaFromBirthdayInDays).toEqual(6)
    contact.birthday = moment({ day: 11, month: 11, year: 1989 }).toDate()
    expect(contact.deltaFromBirthdayInDays).toEqual(10)
  }) 

  test('date evaluation works across a new year', () => {
    advanceTo(new Date(2019, 11, 15, 0, 0, 0))
    const contact = new Contact()
    contact.birthday = moment({ day: 7, month: 0, year: 1989 }).toDate()
    expect(contact.deltaFromBirthdayInDays).toEqual(23)
    contact.birthday = moment({ day: 25, month: 0, year: 1989 }).toDate()
    expect(contact.deltaFromBirthdayInDays).toEqual(41)
  })

  test('ignores hours in the current date', () => {
    advanceTo(new Date(2019, 11, 1, 6, 0, 0))
    const contact = new Contact()
    contact.birthday = moment({ day: 1, month: 11, year: 1989 }).toDate()
    expect(contact.deltaFromBirthdayInDays).toEqual(0)
  })
})

describe('age', () => {
  test('calculates correctly when year is present', () => {
    advanceTo(new Date(2019, 11, 1, 6, 0, 0))
    const contact = new Contact()
    contact.birthday = moment({ day: 15, month: 11, year: 1989 }).toDate()
    expect(contact.age).toEqual(30)
    contact.birthday = moment({ day: 15, month: 11, year: 1999 }).toDate()
    expect(contact.age).toEqual(20)
  })

  test('returns undefined when year is set to undefined year', () => {
    advanceTo(new Date(2019, 11, 1, 6, 0, 0))
    const contact = new Contact()
    contact.birthday = moment({ day: 15, month: 11, year: Contact.UNDEFINED_YEAR }).toDate()
    expect(contact.age).toEqual(undefined)
  })
})