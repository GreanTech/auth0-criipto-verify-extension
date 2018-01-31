import { fromJS } from 'immutable';

import * as constants from '../../constants';
import createReducer from '../utils/createReducer';
import _ from 'lodash'; 
import {verifyDnsName} from '../../dsl';

let initialStateTenants = {
  loading: false,
  error: null,
  tenants: [],
  existingTenant: {}
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
  [constants.FETCH_VERIFY_TENANTS_FULFILLED]: (state, action) => {
    var filtered = _.filter(action.payload, cs =>
      cs.organization.entityIdentifier === constants.GAUSS_ENTITY_ID);
    var mapped = _.map(filtered, cs => fromJS(cs.organization));
    var existingTenant = _.first(mapped) || {};

    return state.merge({
      loading: false,
      error: null,
      tenants: fromJS(action.payload),
      existingTenant: existingTenant
    })}
});

let initialStateVerifyDomains = {
  loading: false,
  error: null,
  existingDomain : null
};

export const verifyDomains = createReducer(fromJS(initialStateVerifyDomains), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_VERIFY_DOMAINS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_VERIFY_DOMAINS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the Criipto Verify domain: ${action.errorMessage}`
    }),
  [constants.FETCH_VERIFY_DOMAINS_FULFILLED]: (state, action) => {
    var expected = verifyDnsName();
    var filtered = _.filter(action.payload.domains || [], domain =>
      domain.name && domain.name === expected);
    var mapped = _.map(filtered, fromJS);
    var existingDomain = _.first(mapped) || null;
    return state.merge({
      loading: false,
      error: null,
      existingDomain: existingDomain
    })},
  [constants.CREATE_VERIFY_DOMAIN_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.CREATE_VERIFY_DOMAIN_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the Criipto Verify domain: ${action.errorMessage}`
    }),
  [constants.CREATE_VERIFY_DOMAIN_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      existingDomain: action.payload      
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
