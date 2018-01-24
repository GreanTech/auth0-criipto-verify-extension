import React from 'react';
import {Router, Route} from 'react-router';
import Home from './Home';
import Login from '../containers/Login';
import RequireAuthentication from '../containers/RequireAuthentication'

export default (history) => {
  return (
    <Router history={history}>
        <Route path="(/)" component={RequireAuthentication(Home)} />
        <Route path="/login" component={Login} />
    </Router>
  )
};