import React, { useState } from 'react'
import { Table, ButtonGroup, Button } from 'react-bootstrap'
import moment from 'moment'
import { useResource, useFetcher } from 'rest-hooks'
import BirthdayResource from '../resources/BirthdayResource'

const BirthdayRow: React.FC<{ birthday: BirthdayResource }> = ({ birthday }) => {
  const update = useFetcher(BirthdayResource.updateShape())

  return (
    <tr key={birthday.id}>
      <td>{ birthday.name }</td>
      <td>{ birthday.birthdayMoment().format('MMMM Do') }</td>
      <td>{ birthday.formattedAge() }</td>
      <td>
        <ButtonGroup>
          <Button onClick={() => update({ id: birthday.id } , { ...birthday, preferences: { ...birthday.preferences, ignore: true }})}>Ignore</Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}

const BirthdayTable: React.FC<{ birthdays: BirthdayResource[] }> = ({ birthdays }) => {
  const [showIgnored, setShowIgnored] = useState(false)

  const ignored = birthdays.filter((b) => b.preferences?.ignore)
  const notIgnored = birthdays.filter((b) => !b.preferences?.ignore)
  let toShow, text

  if (showIgnored) {
    text = "Hide hidden birthdays..."
    toShow = notIgnored.concat(ignored)
  } else {
    text = "Show hidden birthdays..."
    toShow = notIgnored
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Birthday</th>
          <th>Age</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { toShow.map((b, i) => {
          return (
            <BirthdayRow birthday={b} key={i}/>
          )
        })}
        <tr>
          { ignored.length > 0 ? (
            <td colSpan={4}><a href="#" onClick={() => setShowIgnored(!showIgnored)}>{ text }</a></td>
          ) : null }
        </tr>
      </tbody>
    </Table>
  )
}

const BirthdaysScreen: React.FC = () => {
  const birthdays = useResource(BirthdayResource.upcomingShape(), {})

  return (
    <div>
      <p>Within the next 7 days...</p>
      <BirthdayTable birthdays={birthdays.withinSevenDays} />
      <p>Within the next 30 days...</p>
      <BirthdayTable birthdays={birthdays.withinThirtyDays} />
    </div>
  )
}

export default BirthdaysScreen
