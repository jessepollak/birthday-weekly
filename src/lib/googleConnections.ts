import moment, { Moment } from 'moment'
import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'

export interface Connection {
  name: string,
  birthday: Moment,
  connection: object
}

export async function fetchConnectionBirthdays(authContext: OAuth2Client): Promise<Array<Connection>> {
  const service = google.people({version: 'v1', auth: authContext})
  let nextPageToken = undefined
  let connectionsWithBirthdays: Array<Connection> = []

  try {
    do {
      let { data: { connections, nextPageToken: _nextPageToken } } = await service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 250,
        personFields: 'names,emailAddresses,birthdays',
        pageToken: nextPageToken
      })
      nextPageToken = _nextPageToken

      connectionsWithBirthdays = connectionsWithBirthdays.concat(connections.map((person) => {
        if (person.birthdays && person.birthdays.length > 0) {
          const { day, month, year } = person.birthdays[0].date
          return {
            name: person.names[0].displayName,
            birthday: moment({ day, month: month - 1, year }),
            connection: person
          }
        }
      })
        .filter((o) => o !== undefined))
        .sort((a, b) => { return a.birthday.dayOfYear() - b.birthday.dayOfYear() })
    } while (nextPageToken !== undefined)

    return connectionsWithBirthdays
  } catch (err) {
    throw err
  }
}