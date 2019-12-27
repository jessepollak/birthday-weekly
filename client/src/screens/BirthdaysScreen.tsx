import React, { useState, useRef, useEffect } from 'react'
import { ButtonGroup, Table } from 'react-bootstrap'
import { useFetcher, useResource } from 'rest-hooks'
import styles from './BirthdaysScreen.module.css'
import ContactResource from '../resources/ContactResource'
import Button from '../components/Button'

const BirthdayRow: React.FC<{ contact: ContactResource }> = ({ contact }) => {
  const [isSubmittingRequest, setIsSubmittingRequest] = React.useState(false)
  let ignoreText
  const update = useFetcher(ContactResource.updateShape())

  const onIgnoreClick = () => {
    setIsSubmittingRequest(true)
    update({ id: contact.id } , { ...contact, preferences: { ...contact.preferences, ignore: !contact.preferences?.ignore }}).then(() => {
      if (mountedRef.current) setIsSubmittingRequest(false)
    })
  }

  const mountedRef = useRef(true);
  useEffect(() => () => {mountedRef.current = false;},[]);

  if (contact.preferences?.ignore) {
    ignoreText = '🎂 Unignore'
  } else {
    ignoreText = '🚫 Ignore'
  }

  return (
    <tr key={contact.id} className={contact.preferences?.ignore ? styles.birthdayRowIgnored : undefined}>
      <td>{ contact.formattedName() }</td>
      <td>{ contact.birthdayMoment().format('MMM Do') }</td>
      <td>{ contact.formattedAge() }</td>
      <td>
        <ButtonGroup>
          <Button isLoading={isSubmittingRequest} onClick={onIgnoreClick}>{ ignoreText }</Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}

const BirthdayTable: React.FC<{ contacts: ContactResource[] }> = ({ contacts }) => {
  const [showIgnored, setShowIgnored] = useState(false)

  const ignored = contacts.filter((b) => b.preferences?.ignore)
  const notIgnored = contacts.filter((b) => !b.preferences?.ignore)
  let toShow, text

  if (showIgnored) {
    text = "Hide hidden contacts..."
    toShow = notIgnored.concat(ignored)
  } else {
    text = "Show hidden contacts..."
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
            <BirthdayRow contact={b} key={b.id}/>
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
  let contacts = useResource(ContactResource.upcomingBirthdaysShape(), {})
  const refresh = useFetcher(ContactResource.upcomingBirthdaysShape())

  const onRefresh = async () => {
    contacts = await refresh({ update: true }, undefined)
  }

  return (
    <div>
      <Button isLoading={false} onClick={onRefresh}>Refresh</Button>
      <p className={styles.sectionHeader}>Within the next 7 days...</p>
      <BirthdayTable contacts={contacts.withinSevenDays} />
      <p className={styles.sectionHeader}>Within the next 30 days...</p>
      <BirthdayTable contacts={contacts.withinThirtyDays} />
    </div>
  )
}

export default BirthdaysScreen
