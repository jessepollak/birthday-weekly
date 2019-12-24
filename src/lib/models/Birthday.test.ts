import { advanceTo } from 'jest-date-mock'
import { deltaFromCurrentDateInDays } from './Birthday'
import moment = require('moment')

describe('deltaFromCurrentDateInDays', () => {
  test('accurately measures delta', () => {
    advanceTo(new Date(2019, 11, 1, 0, 0, 0))
    expect(deltaFromCurrentDateInDays(moment({ day: 7, month: 11, year: 1989 }))).toEqual(6)
    expect(deltaFromCurrentDateInDays(moment({ day: 11, month: 11, year: 1989 }))).toEqual(10)
  }) 

  test('date evaluation works across a new year', () => {
    advanceTo(new Date(2019, 11, 15, 0, 0, 0))
    expect(deltaFromCurrentDateInDays(moment({ day: 7, month: 0, year: 1989 }))).toEqual(23)
    expect(deltaFromCurrentDateInDays(moment({ day: 25, month: 0, year: 1989 }))).toEqual(41)
  })
})