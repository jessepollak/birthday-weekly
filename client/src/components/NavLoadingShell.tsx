import React, { FunctionComponent, Suspense } from "react"
import { Button, Col, Container, Dropdown, DropdownButton, Navbar, Row } from "react-bootstrap"
import { NetworkErrorBoundary, useFetcher, useInvalidator } from "rest-hooks"
import { useLoggedInUserState } from '../hooks/useLoggedInUser'
import ContactResource from "../resources/ContactResource"
import styles from './NavLoadingShell.module.css'
import Spinner from './Spinner'
interface NavLoadingShellProps {}

const Navigation: FunctionComponent<{}> = () => {
  const loggedInUserState = useLoggedInUserState()

  const refresh = useFetcher(ContactResource.refreshState())
  const clearCache = useInvalidator(ContactResource.upcomingBirthdaysShape())

  const onRefresh = async () => {
    await refresh({}, {})
    clearCache({})
  }

  return (
    <Navbar bg="light" expand={false}>
      <Navbar.Brand href="/"><span role="img" aria-label="cake">🎂</span> <span className={styles.birthdayWeeklyName}>Birthday Weekly</span></Navbar.Brand>
      <div className="justify-content-end">
      { loggedInUserState.state === 'loggedin' ? (
          <DropdownButton
            title={loggedInUserState.user.email}
            id="nav-dropdown"
            alignRight
            variant="secondary"
            className="justify-content-end"
          >
            <Dropdown.Item onClick={onRefresh}>♻️ Refresh contacts</Dropdown.Item>
            <Dropdown.Item href="/auth/logout">Log out</Dropdown.Item>
          </DropdownButton>
      ) : (
        <div>{ loggedInUserState.state === 'loggedout' && (<Button href="/auth/google">Log in</Button> ) }</div>
      )}
      </div>
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
        <Col lg={{ span: 6, offset: 3 }}>
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