import React, { useState, useRef, useEffect } from 'react'
import { ButtonGroup, Table } from 'react-bootstrap'
import { useFetcher, useResource } from 'rest-hooks'
import styles from './BirthdaysScreen.module.css'
import BirthdayResource from '../resources/BirthdayResource'
import Button from '../components/Button'

const BirthdayRow: React.FC<{ birthday: BirthdayResource }> = ({ birthday }) => {
  const [isSubmittingRequest, setIsSubmittingRequest] = React.useState(false)
  let ignoreText
  const update = useFetcher(BirthdayResource.updateShape())

  const onIgnoreClick = () => {
    setIsSubmittingRequest(true)
    update({ id: birthday.id } , { ...birthday, preferences: { ...birthday.preferences, ignore: !birthday.preferences?.ignore }}).then(() => {
      if (mountedRef.current) setIsSubmittingRequest(false)
    })
  }

  const mountedRef = useRef(true);
  useEffect(() => () => {mountedRef.current = false;},[]);

  if (birthday.preferences?.ignore) {
    ignoreText = '🎂 Unignore'
  } else {
    ignoreText = '🚫 Ignore'
  }

  return (
    <tr key={birthday.id} className={birthday.preferences?.ignore ? styles.birthdayRowIgnored : undefined}>
      <td>{ birthday.formattedName() }</td>
      <td>{ birthday.birthdayMoment().format('MMMM Do') }</td>
      <td>{ birthday.formattedAge() }</td>
      <td>
        <ButtonGroup>
          <Button isLoading={isSubmittingRequest} onClick={onIgnoreClick}>{ ignoreText }</Button>
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
    <Table className={styles.table} striped bordered>
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
            <BirthdayRow birthday={b} key={b.id}/>
          )
        })}
        <tr className={styles.showHidden}>
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
      <p className={styles.sectionHeader}>Within the next 7 days...</p>
      <BirthdayTable birthdays={birthdays.withinSevenDays} />
      <p className={styles.sectionHeader}>Within the next 30 days...</p>
      <BirthdayTable birthdays={birthdays.withinThirtyDays} />
    </div>
  )
}

export default BirthdaysScreen
