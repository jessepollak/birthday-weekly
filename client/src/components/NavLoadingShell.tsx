import React, { FunctionComponent, Suspense } from "react"
import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap"
import { NetworkErrorBoundary } from "rest-hooks"
import styled from 'styled-components'
import { UserProvider } from '../contexts/UserContext'
import { useLoggedInUserState } from '../hooks/useLoggedInUser'
import Spinner from './Spinner'

interface NavLoadingShellProps {}

const Navigation: FunctionComponent<{}> = () => {
  const loggedInUserState = useLoggedInUserState()

  return (
    <Navbar bg="light" className="justify-content-between">
      <Navbar.Brand href="/"><span role="img" aria-label="cake">🎂</span> Birthday Weekly</Navbar.Brand>
      { loggedInUserState.state === 'loggedin' ? (
        <NavDropdown title={loggedInUserState.user.email} id="basic-nav-dropdown">
          <NavDropdown.Item href="/auth/logout">Log out</NavDropdown.Item>
        </NavDropdown>
      ) : (
        <div>
          { loggedInUserState.state === 'loggedout' && (
            <Nav.Link href="/auth/google">Log in with Google</Nav.Link>
          )}
        </div>
      )}
    </Navbar>
  )
}

const SuspenseSpinner: React.FC = () => (
  <FallbackSpinner>
    <Spinner />
  </FallbackSpinner>
)
  


export const NavLoadingShell: FunctionComponent<NavLoadingShellProps> = ({ children }) => {
  return (
    <UserProvider>
      <NavGridContainer>
        <Row noGutters>
          <ContentContainer md={{ span: 8, offset: 2 }}>
            <Navigation />
            <Suspense fallback={<SuspenseSpinner />}>
              <NetworkErrorBoundary> 
                { children }
              </NetworkErrorBoundary>
            </Suspense>
          </ContentContainer>
        </Row>
      </NavGridContainer>
    </UserProvider>
  )
}

const NavGridContainer = styled(Container)`
  padding: 0;
`

const ContentContainer = styled(Col)`
  border: 1px solid #efefef;
  min-height: 600px;
`

const FallbackSpinner = styled.div`
  padding: 100px;
`

export default NavLoadingShell