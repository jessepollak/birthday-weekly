import camelize from 'camelize'
import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import User, { UserGoogleCredentials, UserRepository } from '../lib/models/User'

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

export async function fetchConnections(user: User): Promise<Array<object>> {
  const service = google.people({
    version: 'v1',
    auth: createOAuth2Client(user)
  })
  let nextPageToken = undefined
  let contacts = []

  try {
    do {
      let { data: { connections, nextPageToken: _nextPageToken } } = await service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 250,
        personFields: 'names,emailAddresses,birthdays',
        pageToken: nextPageToken
      })
      nextPageToken = _nextPageToken

      contacts = contacts.concat(connections)
    } while (nextPageToken !== undefined)

    return contacts
  } catch (err) {
    throw err
  }
}