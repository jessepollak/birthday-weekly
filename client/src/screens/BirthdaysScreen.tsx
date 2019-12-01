
import React from 'react'
import { Table } from 'react-bootstrap'
import { useResource } from 'rest-hooks'
import UpcomingBirthdaysResource from '../resources/UpcomingBirthdaysResource'

const BirthdaysScreen: React.FC = () => {
  const birthdays = useResource(UpcomingBirthdaysResource.detailShape(), { id: '' })
  console.log(birthdays)

  return (
    <div>
      <h4>Within the next 7 days...</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          { birthdays.withinSevenDays.map((b) => {
            return (
              <tr key={b.id}>
                <td>{ b.name }</td>
                <td>{ b.date }</td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <h2>Within the next 30 days...</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          { birthdays.withinThirtyDays.map((b) => {
            return (
              <tr key={b.id}>
                <td>{ b.name }</td>
                <td>{ b.date }</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default BirthdaysScreen
