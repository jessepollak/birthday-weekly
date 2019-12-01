import React from 'react'
import { Button } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import NavLoadingShell from './components/NavLoadingShell'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <NavLoadingShell>
          <Switch>
            <Route exact path="/">
              <h1>Home</h1>
              <Button>Log in with Google</Button>
            </Route>
            <Route path="/dashboard">
              <h1>Dashboard</h1>
            </Route>
          </Switch>
        </NavLoadingShell>
      </div>
    </Router>
  )
}

export default App
