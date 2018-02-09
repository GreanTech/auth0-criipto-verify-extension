import { fromJS } from 'immutable';

import * as constants from '../../constants';
import createReducer from '../utils/createReducer';
import _ from 'lodash'; 
import {verifyRealm} from '../../dsl';

let initialStateTenants = {
  loading: false,
  error: null,
  tenants: [],
  existingTenant: {},
  registeredTenants: [],
  intent: sessionStorage.getItem('criipto-verify:tenant-intent')
};

const formatError = (action, msgPrefix) => {
  if (!action || !action.payload) {
    return msgPrefix;
  }
  
  var message = action.errorMessage;
  return `${msgPrefix}${(message ? ': ' : '') + message}`;
}

export const verifyTenants = createReducer(fromJS(initialStateTenants), { // eslint-disable-line import/prefer-default-export
  [constants.VERIFY_TENANT_INTENT]: (state, action) => {
    var intent = action.payload.intent;
    sessionStorage.setItem('criipto-verify:tenant-intent', intent);
    return state.merge({
      intent: intent
    })},
  [constants.FETCH_CORE_VERIFY_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_CORE_VERIFY_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while checking the status of the Criipto Verify tenant')
    }),
  [constants.FETCH_CORE_VERIFY_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      error: null
    }),
  [constants.FETCH_VERIFY_TENANTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while loading the Criipto Verify tenant')
    }),
  [constants.FETCH_VERIFY_TENANTS_FULFILLED]: (state, action) =>
    state.merge({
      error: null,
      tenants: fromJS(action.payload)
    }),
  [constants.FETCH_REGISTERED_TENANTS_FULFILLED]: (state, action) => {
    var pl = action.payload;
    return state.merge({
      registeredTenants: fromJS(pl.registeredTenants),
      existingTenant: fromJS(pl.existingTenant)
    })},
  [constants.CREATE_VERIFY_TENANT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while creating a Criipto Verify tenant')
    })
});

let initialStateDefaultDomainAvailable = {
  loading: false,
  error: null,
  domainStatus: null
};

export const checkDomainAvailable = createReducer(fromJS(initialStateDefaultDomainAvailable), { // eslint-disable-line import/prefer-default-export
  [constants.CHECK_VERIFY_DOMAIN_AVAILABLE_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.CHECK_VERIFY_DOMAIN_AVAILABLE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while checking if a Criipto Verify DNS domain is available')
    }),
  [constants.CHECK_VERIFY_DOMAIN_AVAILABLE_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      domainStatus: fromJS(action.payload)
    })
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
      error: formatError(action, 'An error occured while fetching the Criipto Verify domain')
    }),
  [constants.FETCH_VERIFY_DOMAINS_FULFILLED]: (state, action) => {
    var candidate = action.payload.existingDomain;
    var mapped = candidate ? fromJS(candidate) : null;
    return state.merge({
      loading: false,
      error: null,
      existingDomain: mapped
    })},
  [constants.MERGE_VERIFY_DOMAINS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.MERGE_VERIFY_DOMAINS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while merging the Criipto Verify domain')
    }),
  [constants.MERGE_VERIFY_DOMAINS_FULFILLED]: (state, action) => {
    var candidate = action.payload.existingDomain;
    var mapped = candidate ? fromJS(candidate) : null;
    return state.merge({
      loading: false,
      error: null,
      existingDomain: mapped
    })},
  [constants.ENROLL_VERIFY_DOMAIN_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.ENROLL_VERIFY_DOMAIN_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while enrolling a Criipto Verify domain')
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
      error: formatError(action, 'An error occured while creating a Criipto Verify domain')
    }),
  [constants.CREATE_VERIFY_DOMAIN_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      existingDomain: fromJS(action.payload.existingDomain)
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
      error: formatError(action, 'An error occured while loading the Criipto Verify links')
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
  [constants.MERGE_VERIFY_APPLICATIONS_PENDING]: (state) =>
  state.merge({
    loading: true,
    error: null
  }),
  [constants.MERGE_VERIFY_APPLICATIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: formatError(action, 'An error occured while loading the Criipto Verify applications')
  }),
  [constants.MERGE_VERIFY_APPLICATIONS_FULFILLED]: (state, action) => {
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