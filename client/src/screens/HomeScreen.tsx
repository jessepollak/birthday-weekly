import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { useResource } from 'rest-hooks'
import { useLoggedInUserState } from '../hooks/useLoggedInUser'
import BirthdaysScreen from './BirthdaysScreen'

const HomeScreen: React.FC = () => {
  const loggedInUserState = useLoggedInUserState()
  if (loggedInUserState.state === 'loading') return <div></div>

  return (
    <div>
      { loggedInUserState.state === 'loggedin' ? (
        <BirthdaysScreen />
      ) : (
        <div>
          <h1>Home</h1>
          <Button>Log in with Google</Button>
        </div>
      )}
    </div>
  )
}

export default HomeScreen
