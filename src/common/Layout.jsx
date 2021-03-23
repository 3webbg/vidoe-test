import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import 'bulma/css/bulma.css'

import './Layout.css'
import Index from '../modules/agora-login-screen/index'
import Meeting from '../modules/meeting/meeting'

import Login from '../modules/login/Login'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="full">
          <Route exact path="/" component={Login} />
          <Route exact path="/trainer-login" component={Index} />
          <Route exact path="/user-login" component={Index} />
          <Route path="/meeting" component={Meeting} />
        </div>
      </Router>
    )
  }
}

export default App
