import { fromJS } from 'immutable';

import * as constants from '../../constants';
import createReducer from '../utils/createReducer';

let initialStateTenants = {
  loading: false,
  error: null,
  tenants: [],
};

export const verifyTenants = createReducer(fromJS(initialStateTenants), { // eslint-disable-line import/prefer-default-export
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
      tenants: fromJS(action.payload)
    })
});

let initialStateLinks = {
  loading: false,
  error: null,
  linkTemplates: [],
  links: []
};

export const verifyLinks = createReducer(fromJS(initialStateLinks), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_VERIFY_LINKS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_VERIFY_LINKS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the Criipto Verify links: ${action.errorMessage}`
    }),
  [constants.FETCH_VERIFY_LINKS_FULFILLED]: (state, action) => {
      var payload = action.payload;
      return state.merge({
        loading: false,
        error: null,
        linkTemplates: fromJS(payload.linkTemplates),
        links: fromJS(payload.links)
      })
    }
});
