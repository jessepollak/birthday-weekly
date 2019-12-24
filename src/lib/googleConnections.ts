import camelize from 'camelize'
import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import moment from 'moment'
import User, { UserGoogleCredentials, UserRepository } from '../lib/models/User'
import Birthday from './models/Birthday'

function createOAuth2Client(user: User) {
  const client = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  })

  client.setCredentials({
    access_token: user.googleCredentials.accessToken,
    refresh_token: user.googleCredentials.refreshToken
  })
  
  client.refreshAccessToken()

  client.on('tokens', (tokens) => {
    const credentials = camelize(tokens) as UserGoogleCredentials
    UserRepository.updateUserGoogleCredentials(user, credentials)
  })

  return client
}

export async function fetchConnectionBirthdays(user: User): Promise<Array<Birthday>> {
  const service = google.people({
    version: 'v1',
    auth: createOAuth2Client(user)
  })
  let nextPageToken = undefined
  let birthdays: Array<Birthday> = []

  const normalizeId = function(resourceName) {
    return resourceName.match(/people\/(\w+)/)[1]
  }

  try {
    do {
      let { data: { connections, nextPageToken: _nextPageToken } } = await service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 250,
        personFields: 'names,emailAddresses,birthdays',
        pageToken: nextPageToken
      })
      nextPageToken = _nextPageToken

      birthdays = birthdays.concat(connections.map((person) => {
        if (person.birthdays && person.birthdays.length > 0) {
          const { day, month, year } = person.birthdays[0].date
          return new Birthday({
            id: normalizeId(person.resourceName),
            name: person.names[0].displayName,
            image: undefined,
            source: 'google',
            date: moment.utc({ day, month: month - 1, year }),
          })
        }
      })
        .filter((o) => o !== undefined))
        .sort((a, b) => { return a.date.dayOfYear() - b.date.dayOfYear() })
    } while (nextPageToken !== undefined)

    return birthdays
  } catch (err) {
    throw err
  }
}