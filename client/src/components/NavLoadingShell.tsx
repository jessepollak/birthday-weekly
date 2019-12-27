import React, { FunctionComponent, Suspense } from "react"
import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap"
import { NetworkErrorBoundary, useInvalidator } from "rest-hooks"
import { useLoggedInUserState } from '../hooks/useLoggedInUser'
import styles from './NavLoadingShell.module.css'
import Spinner from './Spinner'
import ContactResource from "../resources/ContactResource"
interface NavLoadingShellProps {}

const Navigation: FunctionComponent<{}> = () => {
  const loggedInUserState = useLoggedInUserState()
  const refresh = useInvalidator(ContactResource.upcomingBirthdaysShape())

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/"><span role="img" aria-label="cake">🎂</span> Birthday Weekly</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        { loggedInUserState.state === 'loggedin' ? (
          <NavDropdown title={loggedInUserState.user.email} id="basic-nav-dropdown">
            <NavDropdown.Item href="/auth/logout">Log out</NavDropdown.Item>
            <NavDropdown.Item onClick={() => refresh({ update: true })}>Refresh</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <div>{ loggedInUserState.state === 'loggedout' && (<Nav.Link href="/auth/google">Log in</Nav.Link> ) }</div>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

const MainSpinner: React.FC = () => {
  return (
    <div className={styles.spinnerContainer}>
      <Spinner />
    </div>
  )
}

export const NavLoadingShell: FunctionComponent<NavLoadingShellProps> = ({ children }) => {
  return (
    <Container className={styles.container}>
      <Row noGutters>
        <Col md={{ span: 6, offset: 3 }}>
          <Navigation />
          <Suspense fallback={<MainSpinner />}>
            <NetworkErrorBoundary> 
              { children }
            </NetworkErrorBoundary>
          </Suspense>
        </Col>
      </Row>
    </Container>
  )
}

export default NavLoadingShell