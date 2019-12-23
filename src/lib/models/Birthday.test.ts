import { advanceTo } from 'jest-date-mock'
import Birthday, { isWithinDays } from './Birthday'
import moment = require('moment')

test('within 30 days works', () => {
  advanceTo(new Date(2019, 11, 1, 0, 0, 0))
  expect(isWithinDays(30, moment({ day: 7, month: 11, year: 1989 }))).toEqual(true)
  expect(isWithinDays(30, moment({ day: 1, month: 11, year: 1989 }))).toEqual(true)
  expect(isWithinDays(30, moment({ day: 1, month: 10, year: 1989 }))).toEqual(false)
})

test('within 7 days works', () => {
  advanceTo(new Date(2019, 11, 1, 0, 0, 0))
  expect(isWithinDays(30, moment({ day: 7, month: 11, year: 1989 }))).toEqual(true)
  expect(isWithinDays(30, moment({ day: 1, month: 11, year: 1989 }))).toEqual(true)
  expect(isWithinDays(30, moment({ day: 1, month: 10, year: 1989 }))).toEqual(false)
})

test('date evaluation works across a new year', () => {
  advanceTo(new Date(2019, 11, 15, 0, 0, 0))
  expect(isWithinDays(30, moment({ day: 7, month: 0, year: 1989 }))).toEqual(true)
  expect(isWithinDays(30, moment({ day: 25, month: 0, year: 1989 }))).toEqual(false)
})