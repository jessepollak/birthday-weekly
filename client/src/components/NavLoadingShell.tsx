import React, { FunctionComponent, Suspense } from "react"
import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap"
import { NetworkErrorBoundary, useResource } from "rest-hooks"
import { UserContext, UserProvider } from '../contexts/UserContext'
import UserResource from '../resources/UserResource'
import Spinner from './Spinner'

interface NavLoadingShellProps {}
interface UserLoadingAreaProps {
  setUser: (u: UserResource) => void;
}

const UserLoadingArea: FunctionComponent<UserLoadingAreaProps> = ({ children, setUser }) => {
  setUser(useResource(UserResource.detailShape(), { id: 'me' }))

  return (
    <div>
      { children }
    </div>
  )
}

export const NavLoadingShell: FunctionComponent<NavLoadingShellProps> = ({ children }) => {
  return (
    <UserProvider>
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/"><span role="img" aria-label="cake">🎂</span> Birthday Weekly</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <UserContext.Consumer>
                  { userContext => userContext.user ? (
                    <NavDropdown title={userContext.user.email} id="basic-nav-dropdown">
                      <NavDropdown.Item href="/auth/logout">Log out</NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <Nav.Link href="/auth/google">Log in</Nav.Link>
                  ) }
                </UserContext.Consumer>
              </Navbar.Collapse>
            </Navbar>
            <Suspense fallback={<Spinner />}>
              <NetworkErrorBoundary> 
                <UserContext.Consumer>
                  { userContext => userContext && (
                    <UserLoadingArea setUser={userContext.setUser}>
                      { children }
                    </UserLoadingArea>
                  )}
                </UserContext.Consumer>
              </NetworkErrorBoundary>
            </Suspense>
          </Col>
        </Row>
      </Container>
    </UserProvider>
  )
}

export default NavLoadingShell