import axios from "axios";
import * as constants from '../constants';
import _ from 'lodash'; 
import { localLogout, login, renewAuth } from './auth';
import { toJS } from 'immutable';
import {contentType, jsonResp, getPayload, verifyTenantId, withTenantId, verifyRealm, verifyApplication, defaultVerifyDnsName, tryToJS} from '../dsl'
import { findConnections } from './connection'
import { fetchClients } from './client'

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
  
function fetchCoreVerify() {
    var dnsName = defaultVerifyDnsName();
    var stored = sessionStorage.getItem('criipto-verify-extension:dnsNameCandidate');
    if (stored) {
        dnsName = stored;
        sessionStorage.removeItem('criipto-verify-extension:dnsNameCandidate');        
    }

    return (dispatch) => {
        return dispatch({
            type: constants.FETCH_CORE_VERIFY,
            payload: {
                promise: Promise.all([
                    dispatch(fetchVerifyTenants()),
                    dispatch(fetchVerifyLinks())
                ]).then((resolved) => { 
                    return dispatch(checkDomainAvailable(dnsName))
                }).then((resolved) => {
                    return dispatch(fetchRegisteredTenants())
                }).then(resolved => {
                    return dispatch(fetchExistingVerifyDomains())
                })
            }
        })
    }
}

function fetchCoreAuth0() {
    return (dispatch) => {
        return dispatch({
            type: constants.FETCH_CORE_AUTH0,
            payload: {
                promise: Promise.all([
                    dispatch(fetchClients()),
                    dispatch(findAuth0Connections())
                ])
            }
        })
    }
}

export function fetchCore() {
    return (dispatch) => { 
        dispatch( {
            type: constants.FETCH_CORE,
            payload : {
                promise: 
                    dispatch(fetchCoreVerify())
                    .then((resolved) => {
                        return dispatch(fetchCoreAuth0())
                    })
            }
        })
    }
}

function findAuth0Connections() {
    return (dispatch, getState) => {
        var state = getState();
        var registeredTenants = state.verifyTenants.get('registeredTenants').toJS();
        dispatch(findConnections(registeredTenants));
    }
};

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
                return dispatch({
                    type: constants.CHECK_VERIFY_DOMAIN_AVAILABLE_FULFILLED,
                    payload:
                        { available: true, nameCandidate: dnsName }
                });
            }
        }

        var linkTemplates = state.verifyLinks.get('linkTemplates').toJS();
        var dnsAvailableLink = _.find(linkTemplates, {'rel' : 'easyid:dns-available'});
        var dnsAvailableResource = dnsAvailableLink.href.replace(/{domain}/, dnsName);
        return dispatch({
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

export function useDomainIfAvailable(dnsName, finalAttempt) {
    const cancel = () => { cancel: true }; 
    return (dispatch, getState) => {
        return dispatch(checkDomainAvailable(dnsName))
            .then((resolved) => {
                var state = getState();
                var domainStatus = state.checkDomainAvailable.get('domainStatus').toJS();
                if (!domainStatus || !domainStatus.available) {
                    // No dice, make user try another value
                    throw cancel();
                } else {
                    var existingTenant = state.verifyTenants.get('existingTenant').toJS();
                    if (!existingTenant || !existingTenant.entityIdentifier) {
                        var user = state.auth.get('user');
                        var verifyLinks = state.verifyLinks.get('links').toJS();
                        var verifyLinkTemplates = state.verifyLinks.get('linkTemplates').toJS();                                            
                        return dispatch(createVerifyTenant(user, verifyLinks, verifyLinkTemplates));
                    }
                    return resolved;
                }
            })
            .then((resolved) => {
                var state = getState();
                var existingTenant = state.verifyTenants.get('existingTenant').toJS();
                if (!existingTenant || !existingTenant.entityIdentifier) {
                    var gaussTenants = state.verifyTenants.get('tenants').toJS();
                    if (!gaussTenants || gaussTenants.length === 0) {
                        throw new Error(`Failed to create Verify tenant (entityIdentifier ${constants.GAUSS_ENTITY_ID})`);
                    }
                    else {
                        var verifyLinks = state.verifyLinks.get('links').toJS();
                        var verifyLinkTemplates = state.verifyLinks.get('linkTemplates').toJS();                                            
                        return dispatch(mergeVerifyDomain(_.first(gaussTenants).organization, verifyLinkTemplates, verifyLinks, dnsName));
                    }
                }
            }).then(resolved => {
                return dispatch(fetchExistingVerifyDomains())
            }).then((resolved) => {
                var state = getState();
                var existingDomain = state.verifyDomains.get('existingDomain').toJS();
                if (!existingDomain || !existingDomain.name) {
                    if (finalAttempt) {
                        throw new Error(`Cannot enroll Verify tenant domain ${dnsName}`);
                    } else {
                        return dispatch(useDomainIfAvailable(dnsName, true));
                    }
                }
                return dispatch(mergeVerifyApplications(existingDomain));
            }).catch(e => {
                if (_.isEqual(e, cancel())) {
                    return;
                }
                throw e;
            });
    }
}

function createVerifyTenant(user, verifyLinks, verifyLinkTemplates) {
    var accessRequestLink = _.find(verifyLinks, { 'rel': 'easyid:access-request'});
    var payload = {
        entityIdentifier : constants.GAUSS_ENTITY_ID,
        name: window.config.AUTH0_DOMAIN,
        contactEmail: user.get('email'),
        contactName: user.get('name')
    };
    return (dispatch) => {
        return dispatch({
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
                    .catch(error => {
                        if (!error || !error.response || error.response.status !== 400) {
                            throw error;
                        }
                        return Promise.reject(error);
                    })
                    .then(() => { return dispatch(localLogout()); })
                    .then(() => { return dispatch(renewAuth('/verify')); })
                    .then(() => { return dispatch(fetchVerifyTenants()); })
                }
            }
        )
    }
};

const looksLikeAVerifyTenant = (candidate) => {
    return candidate && candidate.id && candidate.id !== '';
}

function tenantDomainsResource(verifyTenant, verifyLinkTemplates) {
    var verifyDomainsResourceTemplate = 
        _.find(verifyLinkTemplates, {'rel' : 'easyid:tenant-domains'});
    if (!looksLikeAVerifyTenant(verifyTenant)) {
        throw new Error("Specified 'verifyTenant' MUST HAVE an non-empty 'id' property");
    }
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

function fetchExistingVerifyDomains() {
    return (dispatch, getState) => {
        var state = getState();
        var existingTenant = state.verifyTenants.get('existingTenant').toJS();
        if (!looksLikeAVerifyTenant(existingTenant)) {
            return;
        }
        var verifyLinkTemplates = state.verifyLinks.get('linkTemplates').toJS();
        dispatch(fetchVerifyDomain(existingTenant, verifyLinkTemplates));
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
              var existingDomain = _.first(registeredTenantCandidate.domains);
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

function fetchVerifyDomain(verifyTenant, verifyLinkTemplates) {
    return {
        type: constants.FETCH_VERIFY_DOMAINS,
        payload: {
            promise:
                fetchVerifyTenantDomains(verifyTenant, verifyLinkTemplates)
                    .then(tenantDomains => {
                        var candidate = _.first(tenantDomains.domains);
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

function mergeVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName) {
    return (dispatch) => {
        dispatch({
            type: constants.MERGE_VERIFY_DOMAINS,
            payload: {
                promise:
                    fetchVerifyTenantDomains(verifyTenant, verifyLinkTemplates)
                        .then(tenantDomains => {
                            var candidate = filterDomainsByDnsName(tenantDomains.domains, dnsName);
                            if (!candidate) 
                            {
                                return dispatch(createVerifyDomain(verifyTenant, verifyLinkTemplates, dnsName));
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
                                return dispatch(enrollVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName));
                            }
                            else {
                                throw error;
                            }
                        })
                        .then(r => {
                            dispatch(fetchRegisteredTenants());
                            return r;
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
        return dispatch({
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
                    .then(r => {
                        dispatch(fetchRegisteredTenants());
                        return r;
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