import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { refreshJWT, setCurrentUser } from './actions/authentication';
import './App.css';
import BaseLayout from './containers/Layout/Layout';
import Login from './containers/Login/Login';
import setAuthToken from './setAuthToken';
import store from './store';

if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(refreshJWT());
    // store.dispatch(logoutUser());
    // window.location.href = '/'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store = { store }>
        <Router>
          <Switch>
              <Route exact path="/" component={ Login } />
              <BaseLayout />
            </Switch>
          </Router>
        </Provider>
    );
  }
}

export default App;
