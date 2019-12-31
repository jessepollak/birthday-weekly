import React from 'react'
import { Button } from 'react-bootstrap'
import { useLoggedInUserState } from '../hooks/useLoggedInUser'
import BirthdaysScreen from './BirthdaysScreen'
import styles from './HomeScreen.module.css'

const HomeScreen: React.FC = () => {
  const loggedInUserState = useLoggedInUserState()
  if (loggedInUserState.state === 'loading') return <div></div>

  return (
    <div>
      { loggedInUserState.state === 'loggedin' ? (
        <BirthdaysScreen />
      ) : (
        <div className={styles.container}>
          <h1>🎂 Birthday Weekly</h1>
          <p>Birthday Weekly is a little tool that will send you a weekly email with your contacts' upcoming birthdays.</p>
          <Button href="/auth/google">Sign up with Google</Button>
        </div>
      )}
    </div>
  )
}

export default HomeScreen
