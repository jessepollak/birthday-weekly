const { loadCredentialsAndExecute } = require('./src/googleAuth')
const { fetchConnectionBirthdays } = require('./src/googleConnections')
const moment = require('moment')

function isWithinDays(numDays) {
  return (date) => {
    const targetDate = moment().add(numDays, 'days')
    const isWithinCurrentYear = date.dayOfYear() >= moment().dayOfYear() && date.dayOfYear() <= targetDate.dayOfYear()
    const isInNewYear = date.dayOfYear() <= targetDate.dayOfYear() && moment().year() < targetDate.year()
    return isWithinCurrentYear || isInNewYear
  }
}

const run = async () => {
  const connections = await loadCredentialsAndExecute(fetchConnectionBirthdays)

  const groupings = {
    7: connections.filter((c) => { return isWithinDays(7)(c.birthday) }),
    30: connections.filter((c) => { return isWithinDays(30)(c.birthday) }),
    60: connections.filter((c) => { return isWithinDays(60)(c.birthday) })
  }

  for (group in groupings) {
    console.log(`== People with birthday in less than or equal to ${group} days ==`)
    for (connection of groupings[group]) {
      console.log(`${connection.name}'s birthday is on ${connection.birthday.format("MMMM Do YYYY")}`)
    }
  }
}

run()