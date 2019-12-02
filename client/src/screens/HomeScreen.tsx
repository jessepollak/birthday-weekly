import React from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

const HomeScreen: React.FC = () => {
  return (
    <HomeContainer>
      <HomeIcon role="img" aria-label="cake">🎂</HomeIcon>
      <h1>Birthday Weekly</h1>
      <p>Connect your Google account and get a weekly email with the upcoming birthdays of your Google Contacts.</p>
      <Button href="/auth/google">Log in with Google</Button>
    </HomeContainer>
  )
}

const HomeIcon = styled.span`
  font-size: 100px;
`

const HomeContainer = styled.div`
  padding: 30px 10px;
  text-align: center;
`

export default HomeScreen
