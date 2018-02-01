import React, { Component } from 'react';
import { Router, Route, Redirect } from 'react-router';
import Home from './Home';
import ConnectVerify from './ConnectVerify';
import Login from '../containers/Login';
import RequireAuthentication, {RequireDashboardAdmin} from '../containers/RequireAuthentication'

export default (history) => {
  return (
    <Router history={history}>
      <Route path="/" component={RequireDashboardAdmin(ConnectVerify)} history={history} />
      <Route path="/verify" component={RequireDashboardAdmin(RequireAuthentication(Home))} />  
      <Route path="/login" component={Login} />
      <Redirect path="*" to='/' />
    </Router>
  )
};