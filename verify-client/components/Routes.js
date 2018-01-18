import React from 'react';
import {Router, Route} from 'react-router';
// import {connect} from 'react-redux';
import Home from './Home';
import Login from '../containers/Login';
import RequireAuthentication from '../containers/RequireAuthentication'
// import { getVerifyLinks } from '../redux/reducers';

// const mapState = ({verifyLinks}) => ({verifyLinks});
// const mapDispatch = {getVerifyLinks};

export default (history) => {
  return (
    <Router history={history}>
        <Route path="/" component={RequireAuthentication(Home)} />
        {/* <Route path="/" component={RequireAuthentication(Home)} onEnter={getVerifyLinks} /> */}
        <Route path="/login" component={Login} />
    </Router>
  )
};