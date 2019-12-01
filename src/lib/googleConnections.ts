import moment, { Moment } from 'moment'
import camelize from 'camelize'
import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import User, { UserGoogleCredentials,UserRepository } from '../lib/models/User'

export interface Connection {
  name: string,
  birthday: Moment,
  connection: object
}

function createOAuth2Client(user: User) {
  const client = new OAuth2Client()
  client.setCredentials({
    access_token: user.googleCredentials.accessToken,
    refresh_token: user.googleCredentials.refreshToken
  })

  client.on('tokens', (tokens) => {
    const credentials = camelize(tokens) as UserGoogleCredentials
    UserRepository.updateUserGoogleCredentials(user, credentials)
  })

  return client
}

export async function fetchConnectionBirthdays(user: User): Promise<Array<Connection>> {
  const service = google.people({
    version: 'v1',
    auth: createOAuth2Client(user)
  })
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