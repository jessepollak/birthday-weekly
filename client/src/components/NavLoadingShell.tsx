import { useStatefulResource } from '@rest-hooks/legacy'
import React, { FunctionComponent, Suspense } from "react"
import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap"
import { NetworkErrorBoundary } from "rest-hooks"
import { UserProvider } from '../contexts/UserContext'
import UserResource from '../resources/UserResource'
import useLoggedInUser, { useLoggedInUserState } from '../hooks/useLoggedInUser'
import Spinner from './Spinner'

interface NavLoadingShellProps {}

const Navigation: FunctionComponent<{}> = () => {
  const loggedInUserState = useLoggedInUserState()

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/"><span role="img" aria-label="cake">🎂</span> Birthday Weekly</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        { loggedInUserState.state === 'loggedin' ? (
          <NavDropdown title={loggedInUserState.user.email} id="basic-nav-dropdown">
            <NavDropdown.Item href="/auth/logout">Log out</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <div>{ loggedInUserState.state === 'loggedout' && (<Nav.Link href="/auth/google">Log in</Nav.Link> ) }</div>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export const NavLoadingShell: FunctionComponent<NavLoadingShellProps> = ({ children }) => {
  return (
    <UserProvider>
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Navigation />
            <Suspense fallback={<Spinner />}>
              <NetworkErrorBoundary> 
                { children }
              </NetworkErrorBoundary>
            </Suspense>
          </Col>
        </Row>
      </Container>
    </UserProvider>
  )
}

export default NavLoadingShell