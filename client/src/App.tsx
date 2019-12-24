import React from 'react'
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import './App.css'
import NavLoadingShell from './components/NavLoadingShell'
import { useLoggedInUserState } from './hooks/useLoggedInUser'
import HomeScreen from './screens/HomeScreen'
import BirthdaysScreen from './screens/BirthdaysScreen'

interface IAuthenticatedRoute extends RouteProps {}

const AuthenticatedRoute : React.FC<IAuthenticatedRoute> = ({ children, ...rest }) => {
  const loggedInUserState = useLoggedInUserState()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedInUserState.state === 'loggedin' ? (
          children
        ) : (
          <div>
            {loggedInUserState.state === 'loggedout' && (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: location }
                  }}
                />
              )}
          </div>
        )
      }
    />
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <NavLoadingShell>
          <Switch>
            <Route exact path="/">
              <HomeScreen />
            </Route>
            <Route exact path="/birthdays">
              <BirthdaysScreen />
            </Route>
          </Switch>
        </NavLoadingShell>
      </div>
    </Router>
  )
}

export default App
