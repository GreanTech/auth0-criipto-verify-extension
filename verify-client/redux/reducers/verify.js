import { fromJS } from 'immutable';

import * as constants from '../../constants';
import createReducer from '../utils/createReducer';

import axios from "axios";
import _ from 'lodash'; 
/////////////////CONSTANTS/////////////////////
const GET_VERIFY_LINKS = "GET_VERIFY_LINKS";
/////////////////ACTIONS//////////////
const verifyLinks = (verifyRoot) => ({type: GET_VERIFY_LINKS, verifyRoot});

/////////////// ACTION DISPATCHER FUNCTIONS///////////////////

export const getVerifyLinks = () => dispatch => {
  axios.get(window.config.VERIFY_API_ROOT)
    .then((response) => {
      return response.data;
    })
    .then((verifyRoot) => {
      dispatch(verifyLinks(verifyRoot))
    })
    .catch((err) => {
      console.error.bind(err);
    })
};

let initialState = {
  loading: false,
  error: null,
  records: []  
};

export const verify = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_VERIFY_TENANTS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_VERIFY_TENANTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the Criipto Verify tenants: ${action.errorMessage}`
    }),
  [constants.FETCH_VERIFY_TENANTS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload)
    })
});
