import { fromJS } from 'immutable';

import * as constants from '../../constants';
import createReducer from '../utils/createReducer';
import _ from 'lodash'; 
import {verifyDnsName, verifyRealm} from '../../dsl';

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
  [constants.ENROLL_VERIFY_DOMAIN_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.ENROLL_VERIFY_DOMAIN_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while enrolling a Criipto Verify domain: ${action.errorMessage}`
    }),
  [constants.ENROLL_VERIFY_DOMAIN_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      existingDomain: action.payload
    }),
    [constants.CREATE_VERIFY_DOMAIN_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.CREATE_VERIFY_DOMAIN_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while creating a Criipto Verify domain: ${action.errorMessage}`
    }),
  [constants.CREATE_VERIFY_DOMAIN_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null
    })
});


let initialStateLinks = {
  loading: false,
  error: null,
  linkTemplates: null,
  links: null
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

let initialStateApplications = {
  loading: false,
  error: null,
  existingApplication: null
};

export const verifyApplications = createReducer(fromJS(initialStateApplications), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_VERIFY_APPLICATIONS_PENDING]: (state) =>
  state.merge({
    loading: true,
    error: null
  }),
  [constants.FETCH_VERIFY_APPLICATIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the Criipto Verify applications: ${action.errorMessage}`
  }),
  [constants.FETCH_VERIFY_APPLICATIONS_FULFILLED]: (state, action) => {
    var expected = verifyRealm();
    var filtered = _.filter(action.payload.applications || [], app =>
      app.realm && app.realm === expected);
    var mapped = _.map(filtered, fromJS);
    var existingApplication = _.first(mapped) || null;
    return state.merge({
      loading: false,
      error: null,
      existingApplication: existingApplication
    })}
});