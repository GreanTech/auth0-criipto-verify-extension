import axios from "axios";
import * as constants from '../constants';
import _ from 'lodash'; 
import { localLogout, login } from './auth';
import { toJS } from 'immutable';
import {contentType, jsonResp, getPayload, verifyTenantId, withTenantId, verifyRealm, verifyApplication, defaultVerifyDnsName, tryToJS} from '../dsl'

const getScopedClaims = (scopedClaimsLink) => {
    // User may already have onboarded before
    var scopedClaimsRef = scopedClaimsLink.href.replace(
        '{application}', 
        window.btoa(window.config.VERIFY_GAUSS_APP_ID));
    return axios.get(scopedClaimsRef)
        .then(getPayload)
        .then((scopedClaims) => { 
            return scopedClaims.claimScopes; 
        });
}

function fetchVerifyTenants() {
    return {
        type: constants.FETCH_VERIFY_TENANTS,
        payload: {
            promise:
                axios.get(window.config.GAUSS_API_ROOT, jsonResp)
                    .then(getPayload)
                    .then((gaussRoot) => {
                        var scopedClaimsLink = _.find(
                            gaussRoot.linkTemplates, 
                            { 'rel': 'gauss:scoped-user-claims' });
                        if (scopedClaimsLink)
                        {
                            return getScopedClaims(scopedClaimsLink);
                        } 
                        else
                        {
                            // Unknown user
                            return [];
                        }
                    })
        }
    }
};

function fetchVerifyLinks() {
    return { 
        type: constants.FETCH_VERIFY_LINKS,
        payload: {
            promise: 
                axios.get(window.config.VERIFY_API_ROOT)
                .then(getPayload)
        }
    }
  };
  
export function fetchCore() {
    return (dispatch) => { 
        dispatch( {
            type: "FETCH_CORE",
            payload : {
                promise: Promise.all([
                    dispatch(fetchVerifyTenants()),
                    dispatch(fetchVerifyLinks())
                ]).then((resolved) => { 
                    return dispatch(checkDomainAvailable(defaultVerifyDnsName()))
                }).then((resolved) => {
                    return dispatch(fetchRegisteredTenants())
                }).then(resolved => {
                    return dispatch(fetchExistingVerifyDomains(defaultVerifyDnsName()))
                })
            }
        })
    }
}

export function checkDomainAvailable(dnsName) {
    return (dispatch, getState) => {
        var state = getState();
        var registeredTenant = _.first(tryToJS(state.verifyTenants.get('registeredTenants')));
        if (registeredTenant && registeredTenant.domains ) {
            var domainCandidate = filterDomainsByDnsName(registeredTenant.domains, dnsName);
            if (domainCandidate) {
                dispatch({
                    type: constants.FETCH_VERIFY_DOMAINS_FULFILLED,
                    payload:
                        { existingDomain: domainCandidate }                        
                });
                return;
            }
        }

        var linkTemplates = state.verifyLinks.get('linkTemplates').toJS();
        var dnsAvailableLink = _.find(linkTemplates, {'rel' : 'easyid:dns-available'});
        var dnsAvailableResource = dnsAvailableLink.href.replace(/{domain}/, dnsName);
        dispatch({
            type: constants.CHECK_VERIFY_DOMAIN_AVAILABLE,
            payload: {
                promise: 
                    axios.get(dnsAvailableResource)
                        .then(getPayload)
                        .then(r => {
                            return { available: r.available, nameCandidate: dnsName };
                        })
            }
        });
    }
};

export function createVerifyTenant(user, verifyLinks, verifyLinkTemplates) {
    var accessRequestLink = _.find(verifyLinks, { 'rel': 'easyid:access-request'});
    var payload = {
        entityIdentifier : constants.GAUSS_ENTITY_ID,
        name: window.config.AUTH0_DOMAIN,
        contactEmail: user.get('email'),
        contactName: user.get('name')
    };
    return (dispatch) => {
        dispatch({
            type: constants.CREATE_VERIFY_TENANT,
            payload: {
                promise:
                    axios.post(
                        accessRequestLink.href, 
                        payload, 
                        {
                            headers: {
                                'Content-Type' : contentType('access-request')
                            }
                    })
                    .then(() => { return dispatch(localLogout()); })
                    .then(() => { return dispatch(login('/verify')); })
                }
            }
        )
    }
};

function tenantDomainsResource(verifyTenant, verifyLinkTemplates) {
    var verifyDomainsResourceTemplate = 
        _.find(verifyLinkTemplates, {'rel' : 'easyid:tenant-domains'});
    var verifyDomainsResource = 
        withTenantId(verifyDomainsResourceTemplate.href, verifyTenant);
    return verifyDomainsResource;
};

const filterDomainsByDnsName = (domains, dnsName) => {
    var filtered = _.filter(domains || [], domain =>
        domain.name && domain.name === dnsName);
    var existingDomain = _.first(filtered) || null;  
    return existingDomain;
};

function fetchExistingVerifyDomains(dnsName) {
    return (dispatch, getState) => {
        var state = getState();
        var existingTenant = state.verifyTenants.get('existingTenant').toJS();
        var verifyLinkTemplates = state.verifyLinks.get('linkTemplates').toJS();
        dispatch(fetchVerifyDomain(existingTenant, verifyLinkTemplates, dnsName));
    }
};

const fetchJson = (resource) => {
    return axios.get(resource, jsonResp).then(getPayload);
};

const fetchVerifyTenantDomains = (verifyTenant, verifyLinkTemplates) => {
    var verifyDomainsResource = 
        tenantDomainsResource(verifyTenant, verifyLinkTemplates);
    return fetchJson(verifyDomainsResource);
};

function fetchRegisteredTenants() {
    return (dispatch, getState) => {
        var state = getState();
        var gaussTenants = state.verifyTenants.get('tenants').toJS();
        var verifyLinkTemplates = state.verifyLinks.get('linkTemplates').toJS();
        return Promise.all(
            _.map(gaussTenants, gaussTenant => {
                var verifyTenant = gaussTenant.organization;
                return fetchVerifyTenantDomains(verifyTenant, verifyLinkTemplates)
                    .then(tenantDomains => [tenantDomains])
                    .catch(error => {
                        if (!error || !error.response) {
                            throw error;
                        }

                        var message = (error.response.data || {}).message || '';
                        if(error.response.status == 400
                            && message.indexOf(verifyTenantId(verifyTenant)) > 0
                            && message.indexOf('is not registered') > 0 ) {
                                return [];
                        } else if (error.response.status == 403) {
                            return [];
                        } else {
                            throw error;
                        }
                    })
            })
        ).then(resolved => {
            var registeredTenants = _.flatten(resolved);
            var existingTenant = {};
            var registeredTenantCandidate = _.first(registeredTenants);
            if (registeredTenantCandidate) {
              var eid = registeredTenantCandidate.entityId;
              var gaussTenant = _.find(gaussTenants, t => t.organization.entityIdentifier === eid);
              existingTenant = gaussTenant.organization;
              var existingDomain = filterDomainsByDnsName(registeredTenantCandidate.domains, defaultVerifyDnsName());
              if (existingDomain) {
                  dispatch({
                      type: constants.FETCH_VERIFY_DOMAINS_FULFILLED,
                      payload: {
                          existingDomain: existingDomain
                      }
                  })
              }
            }
            return dispatch({ 
                    type: constants.FETCH_REGISTERED_TENANTS_FULFILLED, 
                    payload: {
                        registeredTenants: registeredTenants,
                        existingTenant: existingTenant
                    }
                });
        });
    }
};

function fetchVerifyDomain(verifyTenant, verifyLinkTemplates, dnsName) {
    return {
        type: constants.MERGE_VERIFY_DOMAINS,
        payload: {
            promise:
                fetchVerifyTenantDomains(verifyTenant, verifyLinkTemplates)
                    .then(tenantDomains => {
                        var candidate = filterDomainsByDnsName(tenantDomains.domains, dnsName);
                        return { existingDomain: candidate };
                    })
                    .catch(error => {
                        if (!error || !error.response || error.response.status != 400) {
                            throw error;
                        }

                        var message = (error.response.data || {}).message || '';
                        if(message.indexOf(verifyTenantId(verifyTenant)) > 0
                            && message.indexOf('is not registered') > 0 ) {
                                return { existingDomain: null };
                        }
                        else {
                            throw error;
                        }
                    })
        }
    }
};

export function mergeVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName) {
    return (dispatch) => {
        dispatch({
            type: constants.MERGE_VERIFY_DOMAINS,
            payload: {
                promise:
                    fetchVerifyTenantDomains(verifyTenant, verifyLinkTemplates)
                        .then(getPayload)
                        .then(tenantDomains => {
                            var candidate = filterDomainsByDnsName(tenantDomains.domains, dnsName);
                            if (!candidate) 
                            {
                                dispatch(createVerifyDomain(verifyTenant, verifyLinkTemplates, dnsName));
                            }
                            return { existingDomain: candidate };
                        })
                        .catch(error => {
                            if (!error || !error.response || error.response.status != 400) {
                                throw error;
                            }

                            var message = (error.response.data || {}).message || '';
                            if(message.indexOf(verifyTenantId(verifyTenant)) > 0
                                && message.indexOf('is not registered') > 0 ) {
                                dispatch(enrollVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName));
                            }
                            else {
                                throw error;
                            }
                        })
            }
        })
    }
};

function enrollVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName) {
    var enrollLink = _.find(verifyLinks, { 'rel': 'easyid:enrollment' });
    var cfg = window.config;
    var payload = {
        tenantId: verifyTenantId(verifyTenant),
        entityId : verifyTenant.entityIdentifier,
        domainName: dnsName
    };
    return (dispatch) => {
        dispatch({
            type: constants.ENROLL_VERIFY_DOMAIN,
            payload: {
                promise: 
                    axios.post(
                        enrollLink.href,
                        payload,
                        {
                            headers: {
                                'Content-Type' : contentType('enrollment')
                            }
                        }
                    ).then(getPayload)
                    .then(() => {
                        return dispatch(mergeVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName));
                    })
            }
        })
    }
};

function createVerifyDomain(verifyTenant, verifyLinkTemplates, dnsName) {
    var verifyDomainsResource = 
        tenantDomainsResource(verifyTenant, verifyLinkTemplates);
    var payload = {
        name: dnsName,
        production: false
    };
    return {
        type: constants.CREATE_VERIFY_DOMAIN,
        payload: {
            promise: 
                axios.post(
                    verifyDomainsResource,
                    payload,
                    {
                        headers: {
                            'Content-Type' : contentType('domain')
                        }
                    }
                ).then(getPayload)
                .then(d => {
                    return { existingDomain : d };
                })
        }
    }
};

export function mergeVerifyApplications(verifyDomain) {
    var applicationsLink = _.find(verifyDomain.links, { 'rel': 'easyid:applications' });
    return {
        type: constants.MERGE_VERIFY_APPLICATIONS,
        payload: {
            promise: 
                axios.get(applicationsLink.href, jsonResp)
                    .then(getPayload)
                    .then(r => {
                        if (_.find(r.applications, { realm: verifyRealm() })) {
                            return r;
                        } else {
                            var payload = verifyApplication();
                            return axios.post(
                                applicationsLink.href,
                                payload,
                                {
                                    headers: {
                                        'Content-Type': contentType('application')
                                    }    
                            }).then(getPayload)
                        }
                    })
        }
    }
};