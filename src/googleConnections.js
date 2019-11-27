const moment = require('moment')
const { google } = require('googleapis')

exports.fetchConnectionBirthdays = async function fetchConnectionBirthdays(authContext) {
  const service = google.people({version: 'v1', auth: authContext})
  let nextPageToken = undefined
  let connectionsWithBirthdays = []

  try {
    do {
      let { data, data: { connections } } = await service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 250,
        personFields: 'names,emailAddresses,birthdays',
        pageToken: nextPageToken
      })
      nextPageToken = data.nextPageToken

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
    console.error('The API returned an error: ' + err)
  }
}