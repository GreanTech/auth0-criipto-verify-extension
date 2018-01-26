import React from 'react';
import { Router, Route, Link} from 'react-router';
import Home from './Home';
import ConnectVerify from './ConnectVerify';
import Login from '../containers/Login';
import RequireAuthentication from '../containers/RequireAuthentication'

export default (history) => {
  return (
    <Router history={history}>
      <Route path="/" component={ConnectVerify} history={history} />
      <Route path="/verify" component={RequireAuthentication(Home)} />
      <Route path="/login" component={Login} />
    </Router>
  )
};