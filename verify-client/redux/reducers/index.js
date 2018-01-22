import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { verify } from './verify'
import { auth } from './auth';
import { gauss } from './gauss';

function lastAction(state = null, action) {
    return action;
}

const state = {
  routing: routerReducer,
  auth,
  verify,
  gauss,
  lastAction,
  form: formReducer
};

export default combineReducers(state);
    